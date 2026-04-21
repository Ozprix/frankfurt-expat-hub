import React from 'react';
import { Clock, ExternalLink, AlertCircle, CheckCircle } from '@/lib/icons';

const TaskPreview = ({ task }) => {
  if (!task) return null;

  const getPriorityBadge = (priority) => {
    const styles = {
      'high': 'bg-red-100 text-red-700 border-red-200',
      'medium': 'bg-orange-100 text-orange-700 border-orange-200',
      'low': 'bg-green-100 text-green-700 border-green-200'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold border capitalize ${styles[priority] || styles.medium}`}>
        {priority || 'medium'}
      </span>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Immigration': 'bg-purple-100 text-purple-700',
      'Registration': 'bg-blue-100 text-blue-700',
      'Health': 'bg-green-100 text-green-700',
      'Finance': 'bg-yellow-100 text-yellow-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-600">
       <div className="flex justify-between items-start mb-2">
         <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
           {task.title || "Task Title"}
           {getPriorityBadge(task.priority)}
         </h3>
         <div className="text-xs text-gray-400 font-mono">ID: {task.id}</div>
       </div>

       <p className="text-gray-600 text-sm mb-4">{task.description || "No description provided."}</p>

       <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {task.estimatedDays && (
             <span className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded">
                <Clock className="w-3 h-3 mr-1" /> Est. {task.estimatedDays} days
             </span>
          )}
          {task.category && (
             <span className={`px-2 py-1 rounded-full font-medium ${getCategoryColor(task.category)}`}>
               {task.category}
             </span>
          )}
          {task.officialLink && (
             <a href={task.officialLink} className="flex items-center text-teal-600 hover:underline">
               Official Link <ExternalLink className="w-3 h-3 ml-1" />
             </a>
          )}
       </div>

       {task.dependsOn && task.dependsOn.length > 0 && (
         <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-start gap-1">
             <AlertCircle className="w-3 h-3 mt-0.5" />
             <span>Depends on: {task.dependsOn.join(', ')}</span>
         </div>
       )}
       
       {task.conditions && task.conditions.length > 0 && (
          <div className="mt-3 text-xs text-gray-500 border-t pt-2">
             <span className="font-semibold">Logic Conditions:</span>
             <ul className="list-disc pl-4 mt-1">
               {task.conditions.map((c, i) => (
                 <li key={i}>{c.field} {c.operator} {c.value}</li>
               ))}
             </ul>
          </div>
       )}
    </div>
  );
};

export default TaskPreview;