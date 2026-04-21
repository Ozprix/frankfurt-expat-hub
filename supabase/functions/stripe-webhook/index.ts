import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno';

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const unixToIso = (value: number | null | undefined) =>
  value ? new Date(value * 1000).toISOString() : null;

const amountForSubscription = async (stripe: Stripe, subscription: Stripe.Subscription) => {
  const firstItem = subscription.items.data[0];
  if (!firstItem?.price?.id) return 0;

  const price = await stripe.prices.retrieve(firstItem.price.id);
  return price.unit_amount ?? 0;
};

const upsertSubscription = async (
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription,
) => {
  const userId = subscription.metadata.user_id;
  if (!userId) {
    console.warn('stripe-webhook subscription missing user_id metadata:', subscription.id);
    return;
  }

  const renewalPrice = await amountForSubscription(stripe, subscription);

  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: String(subscription.customer),
      stripe_subscription_id: subscription.id,
      tier: subscription.metadata.tier || 'Pro',
      status: subscription.status,
      billing_period: subscription.metadata.billing_period || null,
      renewal_price: renewalPrice,
      current_period_start: unixToIso(subscription.current_period_start),
      current_period_end: unixToIso(subscription.current_period_end),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' },
  );

  if (error) throw error;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ message: 'Method not allowed' }, 405);

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
      return json({ message: 'Server is not configured' }, 500);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) return json({ message: 'Missing Stripe signature' }, 400);

    const rawBody = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      await upsertSubscription(stripe, supabase, event.data.object as Stripe.Subscription);
    }

    return json({ received: true });
  } catch (error) {
    console.error('stripe-webhook error:', error);
    return json({ message: 'Webhook handler failed' }, 400);
  }
});
