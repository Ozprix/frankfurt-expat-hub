
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/config/supabaseClient';

export const useVideoTutorials = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseClient
        .from('videos')
        .select('*, video_categories(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVideos((data || []).map((video) => ({
        ...video,
        category: video.video_categories?.name || 'General',
      })));
    } catch (err) {
      console.error('Videos fetch error:', err);
      setError(err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return { videos, loading, error, fetchVideos };
};
