import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type CheckoutPayload = {
  priceId?: string;
  userId?: string;
  userEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const getPriceMetadata = (priceId: string) => {
  const entries = [
    { env: 'STRIPE_PRICE_PRO_MONTHLY', tier: 'Pro', billingPeriod: 'monthly' },
    { env: 'STRIPE_PRICE_PRO_ANNUAL', tier: 'Pro', billingPeriod: 'annual' },
    { env: 'STRIPE_PRICE_MOVE_IN_PACK_MONTHLY', tier: 'Move-In Pack', billingPeriod: 'monthly' },
    { env: 'STRIPE_PRICE_MOVE_IN_PACK_ANNUAL', tier: 'Move-In Pack', billingPeriod: 'annual' },
  ];

  return entries.find((entry) => Deno.env.get(entry.env) === priceId) ?? null;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ message: 'Method not allowed' }, 405);

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) return json({ message: 'Stripe is not configured' }, 500);

    const payload = (await req.json()) as CheckoutPayload;
    const priceId = payload.priceId?.trim();
    const userId = payload.userId?.trim();
    const userEmail = payload.userEmail?.trim();
    const successUrl = payload.successUrl?.trim();
    const cancelUrl = payload.cancelUrl?.trim();

    if (!priceId || !userId || !userEmail || !successUrl || !cancelUrl) {
      return json({ message: 'Missing required checkout parameters' }, 400);
    }

    const priceMetadata = getPriceMetadata(priceId);
    if (!priceMetadata) {
      return json({ message: 'Price is not configured for checkout' }, 400);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        user_id: userId,
        tier: priceMetadata.tier,
        billing_period: priceMetadata.billingPeriod,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          tier: priceMetadata.tier,
          billing_period: priceMetadata.billingPeriod,
        },
      },
    });

    return json({ url: session.url });
  } catch (error) {
    console.error('create-checkout-session error:', error);
    return json({ message: 'Failed to create checkout session' }, 500);
  }
});
