import { useState, useEffect } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { 
  getGoogleOAuthURL, 
  getOutlookOAuthURL, 
  GOOGLE_REDIRECT_URI, 
  OUTLOOK_REDIRECT_URI 
} from '@/config/calendarConfig';

const CACHE_KEY = 'calendar_integrations_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const useCalendarIntegration = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIntegrations = async (force = false) => {
    if (!user) return;

    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp, userId } = JSON.parse(cached);
        if (userId === user.id && Date.now() - timestamp < CACHE_TTL) {
          setIntegrations(data);
          setLoading(false);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const { data, error } = await supabaseClient.rpc('get_calendar_integrations', { 
        target_user_id: user.id 
      });

      if (error) throw error;
      setIntegrations(data || []);
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: data || [],
        timestamp: Date.now(),
        userId: user.id
      }));

    } catch (err) {
      console.error('Fetch Integrations Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const initiateGoogleOAuth = () => {
    window.location.href = getGoogleOAuthURL();
  };

  const initiateOutlookOAuth = () => {
    window.location.href = getOutlookOAuthURL();
  };

  const handleOAuthCallback = async (code, provider) => {
    try {
      const functionName = provider === 'google' ? 'google-oauth-callback' : 'outlook-oauth-callback';
      const redirectUri = provider === 'google' ? GOOGLE_REDIRECT_URI : OUTLOOK_REDIRECT_URI;
      
      const { data, error } = await supabaseClient.functions.invoke(functionName, {
        body: { code, redirect_uri: redirectUri }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      await fetchIntegrations(true);
      return data;

    } catch (err) {
      console.error('OAuth Callback Error:', err);
      throw err;
    }
  };

  const disconnectCalendar = async (provider) => {
    try {
      const { data, error } = await supabaseClient.functions.invoke('disconnect-calendar', {
        body: { provider }
      });
      
      if (error) throw error;
      await fetchIntegrations(true);
      return data;
    } catch (err) {
      throw err;
    }
  };
  
  const syncTask = async (task, provider) => {
    // This calls the specific sync function
    const funcName = provider === 'google' ? 'sync-task-to-google' : 'sync-task-to-outlook';
    const { data, error } = await supabaseClient.functions.invoke(funcName, {
        body: { 
            task_id: task.id,
            task_title: task.title,
            task_description: task.description,
            due_date: task.dueDate
        }
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  };

  useEffect(() => {
    fetchIntegrations();
  }, [user]);

  return {
    integrations,
    loading,
    error,
    initiateGoogleOAuth,
    initiateOutlookOAuth,
    handleOAuthCallback,
    disconnectCalendar,
    syncTask,
    refetch: () => fetchIntegrations(true)
  };
};