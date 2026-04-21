
import React from 'react';
import { Plus } from '@/lib/icons';

const CostCategoryCard = ({ category, onAdd }) => {
  return (
    <div 
      className="bg-white p-4 rounded-xl border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
      onClick={onAdd}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl group-hover:bg-teal-50 transition-colors">
          {category.icon || '💰'}
        </div>
        <button className="text-gray-400 hover:text-teal-600">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <h4 className="font-bold text-gray-900">{category.name}</h4>
      <p className="text-xs text-gray-500 mt-1">Avg. €{category.average_cost}</p>
    </div>
  );
};

export default CostCategoryCard;
