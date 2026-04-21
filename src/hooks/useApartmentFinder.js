
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/config/supabaseClient';

export const useApartmentFinder = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseClient
        .from('apartments')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      setApartments(data || []);
    } catch (err) {
      console.error('Apartment fetch error:', err);
      setError(err);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return { apartments, loading, error, fetchApartments };
};
