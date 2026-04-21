import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/config/supabaseClient';

export const useFeatureAccess = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState({
    hasEmailReminders: false,
    hasDocumentTemplates: false,
    hasUnlimitedPlans: false,
    hasUnlimitedTasks: false,
    loading: true
  });

  const checkAccess = async () => {
    if (!user) {
        setFeatures(prev => ({ ...prev, loading: false }));
        return;
    }

    try {
        // We can do this with multiple RPC calls or just infer from subscription tier in frontend
        // Using RPC as requested to be secure/centralized
        const [reminders, docs, unlimitedPlans, unlimitedTasks] = await Promise.all([
            supabaseClient.rpc('check_feature_access', { target_user_id: user.id, feature: 'email_reminders' }),
            supabaseClient.rpc('check_feature_access', { target_user_id: user.id, feature: 'document_templates' }),
            supabaseClient.rpc('check_feature_access', { target_user_id: user.id, feature: 'unlimited_plans' }),
            supabaseClient.rpc('check_feature_access', { target_user_id: user.id, feature: 'unlimited_tasks' })
        ]);

        setFeatures({
            hasEmailReminders: reminders.data,
            hasDocumentTemplates: docs.data,
            hasUnlimitedPlans: unlimitedPlans.data,
            hasUnlimitedTasks: unlimitedTasks.data,
            loading: false
        });

    } catch (err) {
        console.error('Feature access check error:', err);
        setFeatures(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkAccess();
    const interval = setInterval(checkAccess, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  return features;
};