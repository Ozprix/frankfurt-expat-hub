import { useCallback, useState } from 'react';
import { createCheckoutSession } from '@/config/stripeConfig';
import { STRIPE_PRICES } from '@/config/stripePrices';
import { useToast } from '@/components/ui/use-toast';

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startCheckout = useCallback(
    async (priceId, userId, userEmail) => {
      if (!priceId) {
        toast({
          title: 'Checkout unavailable',
          description: 'This plan is not configured yet.',
          variant: 'destructive',
        });
        return null;
      }

      setLoading(true);

      try {
        const data = await createCheckoutSession({
          priceId,
          userId,
          userEmail,
          successUrl: `${window.location.origin}/checkout-success`,
          cancelUrl: `${window.location.origin}/checkout-cancel`,
        });

        if (data?.url) {
          window.location.href = data.url;
          return data;
        }

        throw new Error('Checkout session did not return a redirect URL.');
      } catch (error) {
        toast({
          title: 'Checkout failed',
          description: error.message || 'Please try again in a moment.',
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return {
    loading,
    startCheckout,
    createProMonthlyCheckout: (userId, userEmail) =>
      startCheckout(STRIPE_PRICES.PRO.MONTHLY.id, userId, userEmail),
    createProAnnualCheckout: (userId, userEmail) =>
      startCheckout(STRIPE_PRICES.PRO.ANNUAL.id, userId, userEmail),
    createMoveInPackMonthlyCheckout: (userId, userEmail) =>
      startCheckout(STRIPE_PRICES.MOVE_IN_PACK.MONTHLY.id, userId, userEmail),
    createMoveInPackAnnualCheckout: (userId, userEmail) =>
      startCheckout(STRIPE_PRICES.MOVE_IN_PACK.ANNUAL.id, userId, userEmail),
  };
};
