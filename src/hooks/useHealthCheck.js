
import { useState, useEffect, useCallback } from 'react';
import { checkDatabaseHealth } from '@/utils/databaseHealthCheck';

export const useHealthCheck = (intervalMs = 30000) => {
  const [healthState, setHealthState] = useState({
    isHealthy: true, // Optimistic default
    lastChecked: null,
    errors: [],
    details: null,
    loading: true
  });

  const checkNow = useCallback(async () => {
    setHealthState(prev => ({ ...prev, loading: true }));
    try {
      const result = await checkDatabaseHealth();
      setHealthState({
        isHealthy: result.isHealthy,
        lastChecked: result.timestamp,
        errors: result.errors,
        details: result.details,
        loading: false
      });
      return result;
    } catch (err) {
      setHealthState(prev => ({
        ...prev,
        isHealthy: false,
        errors: [err.message],
        loading: false,
        lastChecked: new Date()
      }));
      return { isHealthy: false, errors: [err.message] };
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkNow();

    // Periodic check
    const intervalId = setInterval(() => {
      checkNow();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs, checkNow]);

  return {
    ...healthState,
    checkNow
  };
};
