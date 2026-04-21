
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useDashboard = (userId) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [monthlyUsage, setMonthlyUsage] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [overviewResult, subscriptionResult, usageResult, statsResult] = await Promise.allSettled([
        supabase.rpc('get_dashboard_overview', { target_user_id: userId }),
        supabase.rpc('get_user_subscription', { target_user_id: userId }),
        supabase.rpc('get_monthly_usage', { target_user_id: userId }),
        supabase.rpc('get_user_stats', { user_id_input: userId }),
      ]);

      if (overviewResult.status === 'fulfilled' && !overviewResult.value.error) {
        setDashboardData(overviewResult.value.data);
      } else {
        console.warn('Dashboard overview unavailable:', overviewResult.reason || overviewResult.value?.error);
        setDashboardData(null);
      }

      if (subscriptionResult.status === 'fulfilled' && !subscriptionResult.value.error) {
        const subData = subscriptionResult.value.data;
        setSubscription(subData && subData.length > 0 ? subData[0] : null);
      } else {
        console.warn('Subscription summary unavailable:', subscriptionResult.reason || subscriptionResult.value?.error);
        setSubscription(null);
      }

      if (usageResult.status === 'fulfilled' && !usageResult.value.error) {
        setMonthlyUsage(usageResult.value.data || []);
      } else {
        console.warn('Monthly usage unavailable:', usageResult.reason || usageResult.value?.error);
        setMonthlyUsage([]);
      }

      if (statsResult.status === 'fulfilled' && !statsResult.value.error) {
        const statsData = statsResult.value.data;
        setUserStats(statsData && statsData.length > 0 ? statsData[0] : null);
      } else {
        console.warn('User stats unavailable:', statsResult.reason || statsResult.value?.error);
        setUserStats(null);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Dashboard metrics are temporarily unavailable.');
      toast({
        title: "Dashboard metrics unavailable",
        description: "Your account is ready. Some activity counters could not be loaded.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId, fetchDashboardData]);

  return { 
    dashboardData, 
    subscription, 
    monthlyUsage, 
    userStats, 
    loading, 
    error,
    refreshDashboard: fetchDashboardData
  };
};
