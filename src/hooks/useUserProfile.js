import { useState, useCallback } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { handlePaymentError } from '@/utils/paymentErrorHandler';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, not an error
          return null;
        }
        if (error.code === '42501') {
          console.warn('RLS: Permission denied loading profile');
          // Don't throw, just return null to avoid breaking UI
          return null;
        }
        throw error;
      }
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error loading profile:', err);
      // Only show toast for non-RLS errors to avoid spamming if it's just a permission thing on load
      if (err.code !== '42501') {
         handlePaymentError(err, 'Load Profile');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveProfile = async (profileData) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          profile_data: profileData,
          onboarding_completed: true,
          updated_at: new Date()
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      handlePaymentError(err, 'Save Profile');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user || !profile) return;
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date() })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      handlePaymentError(err, 'Update Profile');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getPlan = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabaseClient
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
         if (error.code === 'PGRST116') return null;
         if (error.code === '42501') {
            console.warn('RLS: Permission denied loading plan');
            return null;
         }
         throw error;
      }
      setPlan(data);
      return data;
    } catch (err) {
      console.error('Error loading plan:', err);
      if (err.code !== '42501') {
        handlePaymentError(err, 'Get Plan');
      }
    }
  }, [user]);

  const getTasks = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabaseClient
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        if (error.code === '42501') {
           console.warn('RLS: Permission denied loading tasks');
           return [];
        }
        throw error;
      }
      setTasks(data || []);
      return data;
    } catch (err) {
      console.error('Error loading tasks:', err);
      if (err.code !== '42501') {
        handlePaymentError(err, 'Get Tasks');
      }
      return [];
    }
  }, [user]);

  const getDocuments = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        if (error.code === '42501') {
           console.warn('RLS: Permission denied loading documents');
           return [];
        }
        throw error;
      }
      setDocuments(data || []);
      return data;
    } catch (err) {
      console.error('Error loading documents:', err);
      if (err.code !== '42501') {
        handlePaymentError(err, 'Get Documents');
      }
      return [];
    }
  }, [user]);

  return {
    profile,
    plan,
    tasks,
    documents,
    loading,
    error,
    loadProfile,
    saveProfile,
    updateProfile,
    getPlan,
    getTasks,
    getDocuments
  };
};