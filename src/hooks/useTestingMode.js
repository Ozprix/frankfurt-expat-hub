
import { useState, useEffect } from 'react';
import { seedDemoData, clearDemoData } from '@/utils/testingUtils';

export const useTestingMode = () => {
  const [isTesting, setIsTesting] = useState(() => {
    return localStorage.getItem('app_testing_mode') === 'true';
  });
  const [lastAction, setLastAction] = useState(null);

  const enableTestingMode = () => {
    setIsTesting(true);
    localStorage.setItem('app_testing_mode', 'true');
  };

  const disableTestingMode = () => {
    setIsTesting(false);
    localStorage.setItem('app_testing_mode', 'false');
  };

  const seedAll = async () => {
    setLastAction('seeding');
    try {
      await seedDemoData();
      setLastAction('seeded');
      return true;
    } catch (e) {
      console.error(e);
      setLastAction('error');
      return false;
    }
  };

  const clearAll = async () => {
    setLastAction('clearing');
    try {
      await clearDemoData();
      setLastAction('cleared');
      return true;
    } catch (e) {
      console.error(e);
      setLastAction('error');
      return false;
    }
  };

  const generateTestReport = () => {
    return {
      mode: isTesting ? 'Testing' : 'Production',
      dataStatus: {
        forum: !!localStorage.getItem('demo_forum_posts') ? 'Seeded' : 'Empty',
        videos: !!localStorage.getItem('demo_videos') ? 'Seeded' : 'Empty',
        apartments: !!localStorage.getItem('demo_apartments') ? 'Seeded' : 'Empty'
      },
      timestamp: new Date().toISOString()
    };
  };

  return {
    isTesting,
    enableTestingMode,
    disableTestingMode,
    seedAll,
    clearAll,
    generateTestReport,
    lastAction
  };
};
