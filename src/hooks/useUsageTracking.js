import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/config/supabaseClient';

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState({
    plansGenerated: 0,
    tasksCreated: 0,
    loading: true
  });

  const fetchUsage = async () => {
    if (!user) return;
    try {
        const { data, error } = await supabaseClient.rpc('get_monthly_usage', { target_user_id: user.id });
        if (error) throw error;
        
        // rpc returns an array of objects
        if (data && data.length > 0) {
            setUsage({
                plansGenerated: data[0].plans_generated,
                tasksCreated: data[0].tasks_created,
                loading: false
            });
        } else {
             setUsage({ plansGenerated: 0, tasksCreated: 0, loading: false });
        }
    } catch (err) {
        console.error('Error fetching usage:', err);
        setUsage(prev => ({ ...prev, loading: false }));
    }
  };

  const incrementPlansGenerated = async () => {
    if (!user) return 0;
    const { data, error } = await supabaseClient.rpc('increment_usage', { 
        target_user_id: user.id, 
        usage_type: 'plans_generated' 
    });
    if (error) throw error;
    setUsage(prev => ({ ...prev, plansGenerated: data }));
    return data;
  };

  const incrementTasksCreated = async () => {
    if (!user) return 0;
    const { data, error } = await supabaseClient.rpc('increment_usage', { 
        target_user_id: user.id, 
        usage_type: 'tasks_created' 
    });
    if (error) throw error;
    setUsage(prev => ({ ...prev, tasksCreated: data }));
    return data;
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  return {
    ...usage,
    refreshUsage: fetchUsage,
    incrementPlansGenerated,
    incrementTasksCreated
  };
};