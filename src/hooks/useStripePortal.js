import { useState } from 'react';
import { createPortalSession } from '@/config/stripeConfig';
import { useToast } from '@/components/ui/use-toast';

export const useStripePortal = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const redirectToPortal = async (userId) => {
    setLoading(true);
    try {
      const { url, error } = await createPortalSession({ user_id: userId });
      
      if (error) throw new Error(error);
      if (!url) throw new Error("No portal URL returned");

      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Could not access subscription settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { redirectToPortal, loading };
};