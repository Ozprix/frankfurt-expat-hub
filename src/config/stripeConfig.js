import { loadStripe } from '@stripe/stripe-js';
import { supabaseClient } from '@/config/supabaseClient';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('Missing VITE_STRIPE_PUBLISHABLE_KEY. Stripe checkout is disabled.');
}

export const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : Promise.resolve(null);

export const stripeConfig = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  currency: 'eur',
  allowedCountries: ['DE', 'US', 'GB', 'FR', 'ES', 'IT'],
};

// Helper to invoke checkout session creation
export const createCheckoutSession = async (params) => {
  const { data, error } = await supabaseClient.functions.invoke('create-checkout-session', {
    body: params
  });
  
  if (error) throw error;
  return data;
};

// Helper to invoke portal session creation
export const createPortalSession = async (params) => {
  const { data, error } = await supabaseClient.functions.invoke('create-portal-session', {
    body: params
  });
  
  if (error) throw error;
  return data;
};
