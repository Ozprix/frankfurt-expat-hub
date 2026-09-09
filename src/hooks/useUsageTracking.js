import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/config/supabaseClient';

const isMissingRpcError = (error) =>
  error?.code === 'PGRST202' ||
  /could not find the function/i.test(error?.message || '');

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState({
    plansGenerated: 0,
    tasksCreated: 0,
    loading: true
  });

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setUsage({ plansGenerated: 0, tasksCreated: 0, loading: false });
      return;
    }
    try {
        const { data, error } = await supabaseClient.rpc('get_monthly_usage', { target_user_id: user.id });
        if (error) throw error;
        
        const usageByFeature = Object.fromEntries(
          (data || []).map((row) => [row.feature_name, Number(row.usage_count || 0)])
        );

        if (data && data.length > 0) {
            setUsage({
                plansGenerated: usageByFeature.plans_generated || 0,
                tasksCreated: usageByFeature.tasks_created || 0,
                loading: false
            });
        } else {
             setUsage({ plansGenerated: 0, tasksCreated: 0, loading: false });
        }
    } catch (err) {
        console.error('Error fetching usage:', err);
        setUsage(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  const incrementUsageMetric = async (usageType, stateKey) => {
    if (!user) return 0;

    const { data, error } = await supabaseClient.rpc('increment_usage', {
      target_user_id: user.id,
      usage_type: usageType
    });

    if (!error) {
      setUsage(prev => ({ ...prev, [stateKey]: data }));
      return data;
    }

    if (!isMissingRpcError(error)) {
      throw error;
    }

    const { error: insertError } = await supabaseClient.from('usage_logs').insert({
      user_id: user.id,
      feature_name: usageType,
      action: 'increment',
      metadata: { source: 'useUsageTracking' }
    });

    if (insertError) {
      throw insertError;
    }

    let nextValue = 0;
    setUsage((prev) => {
      nextValue = (prev[stateKey] || 0) + 1;
      return { ...prev, [stateKey]: nextValue };
    });

    return nextValue;
  };

  const incrementPlansGenerated = async () => {
    return incrementUsageMetric('plans_generated', 'plansGenerated');
  };

  const incrementTasksCreated = async () => {
    return incrementUsageMetric('tasks_created', 'tasksCreated');
  };

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    ...usage,
    refreshUsage: fetchUsage,
    incrementPlansGenerated,
    incrementTasksCreated
  };
};
