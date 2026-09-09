import { useState, useCallback } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkNewAchievements = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return [];
    }

    setLoading(true);
    try {
      // Call RPC to check and insert new ones
      const { data, error } = await supabaseClient.rpc('check_achievements', { target_user_id: user.id });
      
      if (error) throw error;

      if (data && data.length > 0) {
        // Trigger animations/toasts for each new unlock
        data.forEach(ach => {
          toast({
            title: `🏆 Achievement Unlocked: ${ach.title}`,
            description: "Check your progress dashboard!",
            className: "bg-yellow-50 border-yellow-200"
          });
        });
        
        // Refresh local list if needed
        return data;
      }

      return [];
    } catch (err) {
      console.error('Error checking achievements:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  return {
    checkNewAchievements,
    loading
  };
};
