import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { ArrowRight, Clock } from '@/lib/icons';
import { formatLastUpdated } from '@/utils/progressUtils';

const ProgressCard = ({ plan }) => {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (plan.completion_percentage / 100) * circumference;

  return (
    <Link to="/plan">
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 p-5 transition-all cursor-pointer group h-full flex flex-col"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
            {plan.title || 'Relocation Plan'}
          </h3>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="#e5e7eb"
                strokeWidth={stroke}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={plan.completion_percentage === 100 ? '#10b981' : '#0d9488'}
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-xs font-bold text-gray-700">
              {plan.completion_percentage}%
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tasks</span>
            <span className="font-medium text-gray-900">{plan.completed_tasks}/{plan.total_tasks}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
            <div 
              className={`h-1.5 rounded-full ${plan.completion_percentage === 100 ? 'bg-green-500' : 'bg-teal-500'}`} 
              style={{ width: `${plan.completion_percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
             <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatLastUpdated(plan.last_updated)}
             </div>
             <ArrowRight className="w-4 h-4 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProgressCard;