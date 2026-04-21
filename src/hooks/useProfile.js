
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let profileCache = {
  data: null,
  timestamp: 0
};

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [subscription, setSubscription] = useState(null);

  const fetchProfile = useCallback(async (force = false) => {
    if (!user) return;

    // Check cache
    const now = Date.now();
    if (!force && profileCache.data && (now - profileCache.timestamp < CACHE_TTL)) {
      setProfile(profileCache.data);
      return;
    }

    setLoading(true);
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If no profile exists, use basic auth metadata or empty defaults
      const finalProfile = profileData || {
        user_id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        bio: '',
        location: '',
        phone: '',
        language: 'en',
        timezone: 'UTC'
      };

      setProfile(finalProfile);
      
      // Update cache
      profileCache = {
        data: finalProfile,
        timestamp: now
      };

      // Fetch subscription (separate table usually)
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (subData) setSubscription(subData);

      // Fetch activity logs
      const { data: logs } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (logs) setActivityLogs(logs);

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateProfile = async (updates) => {
    if (!user) return;
    setLoading(true);
    try {
      // Upsert into user_profiles
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Also update auth metadata for critical fields (name, avatar)
      if (updates.first_name || updates.last_name || updates.avatar_url) {
        const metadataUpdates = {};
        if (updates.first_name) metadataUpdates.first_name = updates.first_name;
        if (updates.last_name) metadataUpdates.last_name = updates.last_name;
        if (updates.avatar_url) metadataUpdates.avatar_url = updates.avatar_url;
        if (updates.first_name || updates.last_name) {
          metadataUpdates.full_name = `${updates.first_name || ''} ${updates.last_name || ''}`.trim();
        }

        await supabase.auth.updateUser({
          data: metadataUpdates
        });
      }

      // Update local state and cache
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      profileCache.data = newProfile;
      profileCache.timestamp = Date.now();

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file) => {
    if (!user) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Ensure this bucket exists in Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      await updateProfile({ avatar_url: publicUrl });
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return {
    profile,
    loading,
    activityLogs,
    subscription,
    updateProfile,
    uploadAvatar,
    updatePassword,
    refreshProfile: () => fetchProfile(true)
  };
};
