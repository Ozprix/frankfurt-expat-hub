import { useState } from 'react';
import { supabaseClient } from '@/config/supabaseClient';

export const useContactForm = () => {
  const [loading, setLoading] = useState(false);

  const submitContactForm = async (payload) => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient.functions.invoke('contact-form', {
        body: payload,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: data?.message || 'Message submitted successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Unable to submit message right now.',
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitContactForm,
  };
};
