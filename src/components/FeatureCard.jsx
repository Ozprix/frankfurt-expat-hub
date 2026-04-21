
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@/lib/icons';
import { motion } from '@/lib/motion';

const FeatureCard = ({ title, description, icon: Icon, stats, to, color = "teal" }) => {
  const colorClasses = {
    teal: "bg-teal-50 text-teal-600 hover:bg-teal-100",
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100", 
    amber: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    rose: "bg-rose-50 text-rose-600 hover:bg-rose-100"
  };

  return (
    <Link to={to} className="block h-full">
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col hover:shadow-md transition-all"
      >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color] || colorClasses.teal}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        
        {stats && (
          <div className="text-xs font-medium text-gray-500 mb-4 bg-gray-50 py-1 px-2 rounded inline-block">
            {stats}
          </div>
        )}
        
        <div className="flex items-center text-sm font-bold text-teal-600 mt-auto">
          Go to {title} <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

export default FeatureCard;
