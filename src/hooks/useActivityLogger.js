
import { useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useActivityLogger = () => {
  const logActivity = useCallback(async (userId, featureName, action, metadata = {}) => {
    if (!userId) return;
    try {
      const { error } = await supabase.rpc('log_user_activity', {
        target_user_id: userId,
        feature_name: featureName,
        action: action,
        metadata: metadata
      });
      if (error) console.warn('Failed to log activity:', error);
    } catch (err) {
      console.warn('Error in activity logger:', err);
    }
  }, []);

  const updateLastLogin = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { error } = await supabase.rpc('update_user_last_login', {
        target_user_id: userId
      });
      if (error) console.warn('Failed to update login time:', error);
    } catch (err) {
      console.warn('Error updating login time:', err);
    }
  }, []);

  return { logActivity, updateLastLogin };
};
