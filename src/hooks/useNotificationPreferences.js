import { useState, useEffect } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CACHE_KEY = 'notification_prefs_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPreferences = async (force = false) => {
    if (!user) return;

    // Check Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (!force && cached) {
      const { data, timestamp, userId } = JSON.parse(cached);
      if (userId === user.id && Date.now() - timestamp < CACHE_TTL) {
        setPreferences(data);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      let { data, error } = await supabaseClient
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No preferences found, create default
        const { data: newData, error: createError } = await supabaseClient
          .from('notification_preferences')
          .insert({ user_id: user.id, first_month_reminders: false })
          .select()
          .single();
        
        if (createError) throw createError;
        data = newData;
      } else if (error) {
        throw error;
      }

      setPreferences(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now(),
        userId: user.id
      }));
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates) => {
    try {
      const { data, error } = await supabaseClient
        .from('notification_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now(),
        userId: user.id
      }));

      toast({
        title: "Success",
        description: "Preferences updated successfully."
      });
      return data;
    } catch (err) {
      console.error('Error updating preferences:', err);
      toast({
        title: "Error",
        description: "Failed to update preferences.",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return { preferences, updatePreferences, loading, error };
};
