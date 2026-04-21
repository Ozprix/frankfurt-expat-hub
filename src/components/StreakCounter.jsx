import React from 'react';
import { motion } from '@/lib/motion';
import { Flame } from '@/lib/icons';
import { getMotivationalMessage, getStreakEmoji } from '@/utils/progressUtils';

const StreakCounter = ({ streak }) => {
  const current = streak?.current_streak || 0;
  const best = streak?.longest_streak || 0;
  const message = getMotivationalMessage(current);
  const emoji = getStreakEmoji(current);

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
        <Flame className="w-48 h-48" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-bold uppercase tracking-wider">
               Activity Streak
             </span>
           </div>
           <div className="flex items-baseline gap-2">
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={current}
                className="text-6xl font-black"
              >
                {current}
              </motion.span>
              <span className="text-xl font-medium opacity-90">days</span>
              <span className="text-4xl animate-pulse">{emoji}</span>
           </div>
           <p className="text-orange-100 font-medium text-lg mt-2">{message}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-end">
           <div className="text-sm text-orange-100">
             <p className="opacity-75">All-time Best</p>
             <p className="font-bold text-xl">{best} days</p>
           </div>
           <div className="text-xs text-orange-200 bg-white/10 px-3 py-1 rounded-full">
             Last active: {streak?.last_activity_date ? new Date(streak.last_activity_date).toLocaleDateString() : 'Never'}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;