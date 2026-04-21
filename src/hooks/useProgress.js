import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const CACHE_KEY = 'progress_dashboard_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useProgress = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: null,
    planProgress: [],
    streak: null,
    achievements: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async (force = false) => {
    if (!user) return;

    // Check Cache
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data: cachedData, timestamp, userId } = JSON.parse(cached);
        if (userId === user.id && Date.now() - timestamp < CACHE_TTL) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }
    }

    setLoading(true);
    try {
      // Parallel Fetching
      const [statsRes, plansRes, streakRes, achievementsRes, userAchievementsRes] = await Promise.all([
        supabaseClient.rpc('get_user_stats', { target_user_id: user.id }),
        supabaseClient.from('plan_progress').select('*').eq('user_id', user.id),
        supabaseClient.from('user_streaks').select('*').eq('user_id', user.id).single(),
        supabaseClient.from('achievements').select('*').order('title'),
        supabaseClient.from('user_achievements').select('achievement_id, unlocked_at').eq('user_id', user.id)
      ]);

      if (statsRes.error) throw statsRes.error;

      // Merge achievements
      const userUnlockedIds = new Set(userAchievementsRes.data?.map(ua => ua.achievement_id) || []);
      const mergedAchievements = (achievementsRes.data || []).map(a => ({
        ...a,
        unlocked: userUnlockedIds.has(a.id),
        unlockedAt: userAchievementsRes.data?.find(ua => ua.achievement_id === a.id)?.unlocked_at || null
      }));

      const newData = {
        stats: statsRes.data,
        planProgress: plansRes.data || [],
        streak: streakRes.data || { current_streak: 0, longest_streak: 0, last_activity_date: null },
        achievements: mergedAchievements
      };

      setData(newData);
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: newData,
        timestamp: Date.now(),
        userId: user.id
      }));

    } catch (err) {
      console.error('Error fetching progress:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { ...data, loading, error, refetch: () => fetchProgress(true) };
};