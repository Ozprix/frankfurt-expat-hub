import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/config/supabaseClient';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState({
    tier: 'Free',
    status: 'inactive',
    renewal_date: null,
    renewal_price: 0,
    loading: true,
    error: null
  });

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      // Use the SQL function
      const { data, error } = await supabaseClient
        .rpc('get_user_subscription', { target_user_id: user.id });

      if (error) throw error;

      if (data && data.length > 0) {
        const sub = data[0];
        setSubscription({
          tier: sub.tier || 'Free',
          status: sub.status || 'inactive',
          renewal_date: sub.renewal_date || sub.current_period_end
            ? new Date(sub.renewal_date || sub.current_period_end)
            : null,
          renewal_price: sub.renewal_price || 0,
          billing_period: sub.billing_period || null,
          loading: false,
          error: null
        });
      } else {
         // Default Free state
         setSubscription({
            tier: 'Free',
            status: 'inactive',
            renewal_date: null,
            renewal_price: 0,
            billing_period: null,
            loading: false,
            error: null
         });
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setSubscription(prev => ({ ...prev, loading: false, error: err }));
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
    
    // Refresh every 5 minutes (TTL)
    const interval = setInterval(fetchSubscription, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchSubscription]);

  const isPro = subscription.tier === 'Pro' || subscription.tier === 'Move-In Pack';
  const isMoveInPack = subscription.tier === 'Move-In Pack';
  const isFree = !isPro;
  const getRenewalPrice = () => subscription.renewal_price || 0;

  return {
    ...subscription,
    isPro,
    isMoveInPack,
    isFree,
    getRenewalPrice,
    refetch: fetchSubscription
  };
};
