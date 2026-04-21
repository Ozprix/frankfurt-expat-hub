
import { useState } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const submitFeatureRating = async (featureName, rating, comment = '') => {
    setLoading(true);
    try {
      if (!user) throw new Error('You must be signed in to submit feedback.');

      const { error } = await supabaseClient.from('user_feedback').insert({
        user_id: user.id,
        feature_name: featureName,
        rating,
        comment,
        feedback_type: 'general',
      });

      if (error) throw error;
      
      toast({
        title: "Feedback Received",
        description: "Thank you for rating this feature!",
        className: "bg-green-50 border-green-200"
      });
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitBugReport = async (featureName, description) => {
    setLoading(true);
    try {
      if (!user) throw new Error('You must be signed in to submit a bug report.');

      const { error } = await supabaseClient.from('user_feedback').insert({
        user_id: user.id,
        feature_name: featureName,
        comment: description,
        feedback_type: 'bug',
      });

      if (error) throw error;

      toast({
        title: "Bug Report Sent",
        description: "Thanks for helping us improve!",
      });
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit bug report. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackSummary = async () => {
    const { data, error } = await supabaseClient
      .from('user_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Feedback summary error:', error);
      return [];
    }

    return data || [];
  };

  return {
    submitFeatureRating,
    submitBugReport,
    getFeedbackSummary,
    loading
  };
};
