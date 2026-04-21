
import { useState } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { hasConsent } from '@/utils/consent';

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

	  const trackFeatureUsage = async (featureName, action, metadata = {}) => {
	    try {
	      if (!user) return;
	      if (!hasConsent('analytics')) return;

	      const { error } = await supabaseClient.from('user_analytics').insert({
        user_id: user.id,
        feature_name: featureName,
        action,
        metadata,
      });

      if (error) throw error;
    } catch (e) {
      console.error('Analytics error:', e);
    }
  };

  const trackPageView = (pageName) => {
    trackFeatureUsage('page', 'view', { pageName });
  };

  const trackVideoWatch = (videoId, watchTime) => {
    trackFeatureUsage('video', 'watch', { videoId, watchTime });
  };

  const trackApartmentSearch = (filters) => {
    trackFeatureUsage('apartment_search', 'search', { filters });
  };

  const getFeatureStats = async (featureName) => {
    setLoading(true);
    try {
      let query = supabaseClient
        .from('user_analytics')
        .select('user_id, created_at, feature_name');

      if (featureName) {
        query = query.eq('feature_name', featureName);
      }

      const { data, error } = await query;
      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const rows = data || [];
      const activeUsers = new Set(
        rows
          .filter((row) => row.user_id && new Date(row.created_at) >= today)
          .map((row) => row.user_id)
      );

      return {
        dailyActiveUsers: activeUsers.size,
        totalInteractions: rows.length,
        avgSessionDuration: 'n/a'
      };
    } catch (error) {
      console.error('Feature stats error:', error);
      return {
        dailyActiveUsers: 0,
        totalInteractions: 0,
        avgSessionDuration: 'n/a'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    trackFeatureUsage,
    trackPageView,
    trackVideoWatch,
    trackApartmentSearch,
    getFeatureStats,
    loading
  };
};
