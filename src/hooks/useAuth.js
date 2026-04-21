import { useState, useEffect } from 'react';
import { supabaseClient } from '@/config/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
          setError(error.message);
        }
        if (session?.user) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Unexpected auth error:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, fullName) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create user in Supabase Auth
      const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

	      if (data?.session && data?.user) {
	        setUser(data.user);
	        // 2. Create user entry in public.users table
	        try {
          const { error: dbError } = await supabaseClient
            .from('users')
            .insert([
              { 
                id: data.user.id, 
                email: email, 
                full_name: fullName 
              }
            ]);
          
          if (dbError) {
            if (dbError.code === '42501') {
              console.warn('RLS Policy prevented public user record creation. This is expected if policies are strict.', dbError);
            } else if (!dbError.message.includes('duplicate key')) {
               console.warn('Could not create public user record:', dbError);
            }
          }
        } catch (dbCatchError) {
           console.warn('Error attempting to create public user record:', dbCatchError);
        }
      }

      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      let errorMessage = err.message;
      // Normalize rate limit error
      if (errorMessage.includes('rate limit') || errorMessage.includes('Too many requests') || errorMessage.includes('over_email_send_rate_limit')) {
        errorMessage = 'over_email_send_rate_limit';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      return { success: true, user: data.user };
    } catch (err) {
      let errorMessage = err.message;
      // Normalize email confirmation error
      if (err.message.includes('Email not confirmed')) {
        errorMessage = 'email_not_confirmed';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error: signOutError } = await supabaseClient.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      return { success: true };
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes('rate limit') || errorMessage.includes('Too many requests')) {
        errorMessage = 'over_email_send_rate_limit';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password) => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabaseClient.auth.updateUser({ password });
      if (updateError) throw updateError;
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates) => {
    if (!user) return { success: false, error: 'No authenticated user.' };

    const metadataUpdates = {};
    if (updates.full_name || updates.fullName) {
      metadataUpdates.full_name = updates.full_name || updates.fullName;
    }
    if (typeof updates.onboardingCompleted === 'boolean') {
      metadataUpdates.onboarding_completed = updates.onboardingCompleted;
    }

    try {
      const { data, error: authError } = await supabaseClient.auth.updateUser({
        data: metadataUpdates,
      });
      if (authError) throw authError;

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const resendVerificationEmail = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const { error: resendError } = await supabaseClient.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (resendError) throw resendError;
      return { success: true };
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes('rate limit') || errorMessage.includes('Too many requests')) {
        errorMessage = 'over_email_send_rate_limit';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = () => user;

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateUser,
    resendVerificationEmail,
    getCurrentUser
  };
};
