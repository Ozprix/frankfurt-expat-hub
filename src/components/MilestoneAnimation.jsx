import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';

const MilestoneAnimation = ({ trigger, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <motion.div 
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-4xl font-extrabold text-teal-600 drop-shadow-lg bg-white/90 px-6 py-3 rounded-xl">
              Plan Complete!
            </h2>
          </div>
          {/* Simple confetti particles could be added here with more divs */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MilestoneAnimation;