import React from 'react';
import { motion } from '@/lib/motion';
import { Lock } from '@/lib/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AchievementBadges = ({ achievements }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {achievements.map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`relative p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                  badge.unlocked 
                    ? 'bg-white border-teal-100 shadow-sm' 
                    : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                }`}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h4 className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {badge.title}
                </h4>
                
                {!badge.unlocked && (
                   <div className="absolute top-2 right-2">
                     <Lock className="w-3 h-3 text-gray-400" />
                   </div>
                )}
                
                {badge.unlocked && badge.unlockedAt && (
                  <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mt-2">
                    Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{badge.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default AchievementBadges;