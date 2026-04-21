import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/config/supabaseClient';
import { generatePlan } from '@/utils/planGenerationLogic';

const planLocalKey = (userId) => `plan_${userId}`;
const onboardingLocalKey = (userId) => `onboarding_${userId}`;

const readJson = (key, fallback = null) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const usePlan = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);
  const userId = user?.id;

  const persistTasks = useCallback(async (updatedTasks) => {
    if (!userId) return;

    window.localStorage.setItem(planLocalKey(userId), JSON.stringify(updatedTasks));

    const { error } = await supabaseClient
      .from('user_plans')
      .upsert({
        user_id: userId,
        plan_data: updatedTasks,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;
  }, [userId]);

  const saveTasks = useCallback((updatedTasks) => {
    setTasks(updatedTasks);
    if (!userId) return;

    window.localStorage.setItem(planLocalKey(userId), JSON.stringify(updatedTasks));
    persistTasks(updatedTasks)
      .then(() => setSyncError(null))
      .catch((error) => {
        console.warn('Could not sync relocation plan.', error);
        setSyncError(error);
      });
  }, [persistTasks, userId]);

  const loadPlan = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSyncError(null);

    const localPlan = readJson(planLocalKey(userId), []);
    const localOnboarding = readJson(onboardingLocalKey(userId), null);
    if (localPlan.length > 0) setTasks(localPlan);

    try {
      const [{ data: planData, error: planError }, { data: profileData, error: profileError }] = await Promise.all([
        supabaseClient
          .from('user_plans')
          .select('plan_data')
          .eq('user_id', userId)
          .maybeSingle(),
        supabaseClient
          .from('user_profiles')
          .select('profile_data')
          .eq('user_id', userId)
          .maybeSingle(),
      ]);

      if (planError) throw planError;
      if (profileError) throw profileError;

      if (Array.isArray(planData?.plan_data) && planData.plan_data.length > 0) {
        setTasks(planData.plan_data);
        window.localStorage.setItem(planLocalKey(userId), JSON.stringify(planData.plan_data));
        return;
      }

      const profile = profileData?.profile_data || localOnboarding;
      const nextPlan = localPlan.length > 0 ? localPlan : profile ? generatePlan(profile) : [];
      setTasks(nextPlan);
      if (nextPlan.length > 0) await persistTasks(nextPlan);
    } catch (error) {
      console.warn('Plan sync failed; using local fallback.', error);
      setSyncError(error);
      if (localPlan.length > 0) {
        setTasks(localPlan);
      } else if (localOnboarding) {
        setTasks(generatePlan(localOnboarding));
      }
    } finally {
      setLoading(false);
    }
  }, [persistTasks, userId]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: task.id || Date.now().toString(),
      status: task.status || 'pending',
      notes: task.notes || '',
      createdAt: new Date().toISOString(),
    };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (taskId, updates) => {
    saveTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
  };

  const deleteTask = (taskId) => {
    saveTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find((candidate) => candidate.id === taskId);
    if (!task) return;

    const status = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(taskId, {
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : null,
    });
  };

  const regeneratePlan = async (profileOverride = null) => {
    if (!userId) return [];

    const profile = profileOverride || readJson(onboardingLocalKey(userId), null);
    if (!profile) return [];

    const nextPlan = generatePlan(profile);
    setTasks(nextPlan);
    window.localStorage.setItem(planLocalKey(userId), JSON.stringify(nextPlan));

    try {
      await persistTasks(nextPlan);
      setSyncError(null);
    } catch (error) {
      console.warn('Could not sync regenerated plan.', error);
      setSyncError(error);
    }

    return nextPlan;
  };

  return {
    tasks,
    loading,
    syncError,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    regeneratePlan,
    refresh: loadPlan,
  };
};
