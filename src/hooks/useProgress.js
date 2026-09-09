import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const CACHE_KEY = 'progress_dashboard_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const isMissingRelationError = (error) =>
  error?.code === 'PGRST205' ||
  /relation .* does not exist/i.test(error?.message || '');

const buildPlanProgress = (rows = []) =>
  rows.flatMap((row) => {
    const tasks = Array.isArray(row.plan_data) ? row.plan_data : [];
    if (tasks.length === 0) {
      return [];
    }

    const completedTasks = tasks.filter((task) => task?.status === 'completed').length;
    const totalTasks = tasks.length;

    return [{
      id: row.id,
      title: 'Relocation Plan',
      completed_tasks: completedTasks,
      total_tasks: totalTasks,
      completion_percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      last_updated: row.updated_at,
    }];
  });

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
    if (!user) {
      setLoading(false);
      return;
    }

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
      const [statsResult, plansResult, streakResult, achievementsResult, userAchievementsResult] = await Promise.allSettled([
        supabaseClient.rpc('get_user_stats', { user_id_input: user.id }),
        supabaseClient.from('user_plans').select('id, plan_data, updated_at').eq('user_id', user.id),
        supabaseClient.from('user_streaks').select('*').eq('user_id', user.id).single(),
        supabaseClient.from('achievements').select('*').order('title'),
        supabaseClient.from('user_achievements').select('achievement_id, unlocked_at').eq('user_id', user.id)
      ]);

      const statsRes = statsResult.status === 'fulfilled' ? statsResult.value : { data: null, error: statsResult.reason };
      const plansRes = plansResult.status === 'fulfilled' ? plansResult.value : { data: [], error: plansResult.reason };
      const streakRes = streakResult.status === 'fulfilled' ? streakResult.value : { data: null, error: streakResult.reason };
      const achievementsRes = achievementsResult.status === 'fulfilled' ? achievementsResult.value : { data: [], error: achievementsResult.reason };
      const userAchievementsRes = userAchievementsResult.status === 'fulfilled' ? userAchievementsResult.value : { data: [], error: userAchievementsResult.reason };

      if (statsRes.error) {
        throw statsRes.error;
      }

      [plansRes, streakRes, achievementsRes, userAchievementsRes].forEach((result) => {
        if (result.error && !isMissingRelationError(result.error)) {
          console.warn('Progress auxiliary query unavailable:', result.error);
        }
      });

      // Merge achievements
      const userUnlockedIds = new Set(userAchievementsRes.data?.map(ua => ua.achievement_id) || []);
      const mergedAchievements = (achievementsRes.data || []).map(a => ({
        ...a,
        unlocked: userUnlockedIds.has(a.id),
        unlockedAt: userAchievementsRes.data?.find(ua => ua.achievement_id === a.id)?.unlocked_at || null
      }));

      const statsRow = Array.isArray(statsRes.data) ? (statsRes.data[0] || null) : statsRes.data;
      const planProgress = buildPlanProgress(plansRes.data || []);
      const totalCompletedTasks = planProgress.reduce(
        (sum, plan) => sum + Number(plan.completed_tasks || 0),
        0
      );
      const totalPlanTasks = planProgress.reduce(
        (sum, plan) => sum + Number(plan.total_tasks || 0),
        0
      );
      const unlockedAchievementsCount = mergedAchievements.filter((achievement) => achievement.unlocked).length;

      const normalizedStats = statsRow
        ? {
            ...statsRow,
            total_tasks_completed_this_month: Number(statsRow.completed_tasks || 0),
            unlocked_achievements_count: unlockedAchievementsCount,
            overall_completion_percentage: totalPlanTasks > 0
              ? Math.round((totalCompletedTasks / totalPlanTasks) * 100)
              : 0,
          }
        : null;

      const newData = {
        stats: normalizedStats,
        planProgress,
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
