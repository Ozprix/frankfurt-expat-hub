import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export const FIRST_30_DAYS_CHECKLIST_KEY = 'first-30-days';

const dashboardLocalKey = (userId) => `fes:dashboard-checklist:${userId || 'guest'}`;
const reminderLocalKey = (userId) => `fes:reminders:${userId || 'guest'}`;

const readLocalCompletedTasks = (userId) => {
  try {
    const stored = window.localStorage.getItem(dashboardLocalKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const readLocalReminderFlag = (userId) => {
  try {
    return window.localStorage.getItem(reminderLocalKey(userId)) === 'true';
  } catch {
    return false;
  }
};

export const useRetentionState = (checklistKey = FIRST_30_DAYS_CHECKLIST_KEY) => {
  const { user } = useAuth();
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [saved, setSaved] = useState(false);
  const [firstMonthReminders, setFirstMonthReminders] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);

  const userId = user?.id;

  const upsertChecklistState = useCallback(async (updates) => {
    if (!userId) return null;

    const payload = {
      user_id: userId,
      checklist_key: checklistKey,
      completed_task_ids: completedTaskIds,
      saved,
      updated_at: new Date().toISOString(),
      ...updates,
    };

    const { data, error } = await supabaseClient
      .from('user_checklist_state')
      .upsert(payload, { onConflict: 'user_id,checklist_key' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }, [checklistKey, completedTaskIds, saved, userId]);

  const loadRetentionState = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setSyncError(null);

    const localCompleted = readLocalCompletedTasks(userId);
    const localReminder = readLocalReminderFlag(userId);

    try {
      const [{ data: checklistData, error: checklistError }, { data: preferencesData, error: preferencesError }] =
        await Promise.all([
          supabaseClient
            .from('user_checklist_state')
            .select('*')
            .eq('user_id', userId)
            .eq('checklist_key', checklistKey)
            .maybeSingle(),
          supabaseClient
            .from('notification_preferences')
            .select('first_month_reminders')
            .eq('user_id', userId)
            .maybeSingle(),
        ]);

      if (checklistError) throw checklistError;
      if (preferencesError && preferencesError.code !== 'PGRST116') throw preferencesError;

      if (checklistData) {
        setCompletedTaskIds(checklistData.completed_task_ids || []);
        setSaved(Boolean(checklistData.saved));
      } else if (localCompleted.length > 0) {
        const migrated = await supabaseClient
          .from('user_checklist_state')
          .upsert({
            user_id: userId,
            checklist_key: checklistKey,
            completed_task_ids: localCompleted,
            saved: window.localStorage.getItem('fes:first-30-days-checklist-saved') === 'true',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,checklist_key' })
          .select()
          .single();

        if (migrated.error) throw migrated.error;
        setCompletedTaskIds(migrated.data.completed_task_ids || []);
        setSaved(Boolean(migrated.data.saved));
      } else {
        setCompletedTaskIds([]);
        setSaved(false);
      }

      setFirstMonthReminders(Boolean(preferencesData?.first_month_reminders || localReminder));
      if (!preferencesData && localReminder) {
        await supabaseClient
          .from('notification_preferences')
          .upsert({
            user_id: userId,
            first_month_reminders: true,
          }, { onConflict: 'user_id' });
      }
    } catch (error) {
      console.warn('Retention state sync failed; using local fallback.', error);
      setSyncError(error);
      setCompletedTaskIds(localCompleted);
      setSaved(window.localStorage.getItem('fes:first-30-days-checklist-saved') === 'true');
      setFirstMonthReminders(localReminder);
    } finally {
      setLoading(false);
    }
  }, [checklistKey, userId]);

  useEffect(() => {
    loadRetentionState();
  }, [loadRetentionState]);

  const setCompletedTasks = useCallback(async (taskIds) => {
    setCompletedTaskIds(taskIds);
    if (userId) {
      window.localStorage.setItem(dashboardLocalKey(userId), JSON.stringify(taskIds));
    }

    try {
      await upsertChecklistState({ completed_task_ids: taskIds });
      setSyncError(null);
    } catch (error) {
      console.warn('Could not persist checklist state.', error);
      setSyncError(error);
    }
  }, [upsertChecklistState, userId]);

  const toggleTask = useCallback((taskId) => {
    const next = completedTaskIds.includes(taskId)
      ? completedTaskIds.filter((id) => id !== taskId)
      : [...completedTaskIds, taskId];
    setCompletedTasks(next);
  }, [completedTaskIds, setCompletedTasks]);

  const saveChecklist = useCallback(async () => {
    setSaved(true);
    try {
      window.localStorage.setItem('fes:first-30-days-checklist-saved', 'true');
      await upsertChecklistState({ saved: true });
      setSyncError(null);
      return { success: true };
    } catch (error) {
      console.warn('Could not persist saved checklist flag.', error);
      setSyncError(error);
      return { success: false, error };
    }
  }, [upsertChecklistState]);

  const setReminderOptIn = useCallback(async (enabled) => {
    setFirstMonthReminders(enabled);
    if (userId) {
      window.localStorage.setItem(reminderLocalKey(userId), String(enabled));
    }

    try {
      const { error } = await supabaseClient
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          first_month_reminders: enabled,
        }, { onConflict: 'user_id' });

      if (error) throw error;
      setSyncError(null);
      return { success: true };
    } catch (error) {
      console.warn('Could not persist first-month reminder preference.', error);
      setSyncError(error);
      return { success: false, error };
    }
  }, [userId]);

  return useMemo(() => ({
    completedTaskIds,
    firstMonthReminders,
    loading,
    saved,
    saveChecklist,
    setCompletedTasks,
    setReminderOptIn,
    syncError,
    toggleTask,
    refresh: loadRetentionState,
  }), [
    completedTaskIds,
    firstMonthReminders,
    loadRetentionState,
    loading,
    saveChecklist,
    saved,
    setCompletedTasks,
    setReminderOptIn,
    syncError,
    toggleTask,
  ]);
};
