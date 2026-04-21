import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { tasksRegistry } from '@/data/tasksRegistry';
import { evaluateConditions } from '@/utils/planGenerationLogic';
import { useAuth } from '@/context/AuthContext';
import { Search, CheckCircle, XCircle } from '@/lib/icons';

const TasksRegistryEditor = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get user profile from local storage for testing
  const onboardingData = localStorage.getItem(`onboarding_${user?.id}`);
  const userProfile = onboardingData ? JSON.parse(onboardingData) : null;

  const filteredTasks = tasksRegistry.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    task.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Registry Editor | Frankfurt Expat Services Admin</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tasks Registry Admin</h1>
            <p className="text-gray-600">Inspect and debug task definitions</p>
          </div>

          {/* Test Profile View */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold mb-4">Current Test Profile</h2>
            {userProfile ? (
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-40">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            ) : (
              <div className="text-amber-600">No onboarding profile found for current user. Please complete onboarding flow.</div>
            )}
          </div>

          <div className="mb-6 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Search tasks by ID or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          <div className="space-y-6">
            {filteredTasks.map(task => {
              const matchesProfile = userProfile ? evaluateConditions(userProfile, task.conditions) : false;

              return (
                <div key={task.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 font-mono">{task.id}</h3>
                      <p className="text-sm text-gray-500">{task.title}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${matchesProfile ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                        {matchesProfile ? 'Active for User' : 'Inactive'}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">v{task.version}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                       <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wider mb-2">Configuration</h4>
                       <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                         <dt className="text-gray-500">Category:</dt>
                         <dd className="font-medium text-gray-900">{task.category}</dd>
                         
                         <dt className="text-gray-500">Jurisdiction:</dt>
                         <dd className="font-medium text-gray-900">{task.jurisdiction}</dd>

                         <dt className="text-gray-500">Priority:</dt>
                         <dd className="font-medium text-gray-900">{task.priority}</dd>
                         
                         <dt className="text-gray-500">Est. Days:</dt>
                         <dd className="font-medium text-gray-900">{task.estimatedDays}</dd>

                         <dt className="text-gray-500">Depends On:</dt>
                         <dd className="font-medium text-gray-900">
                            {task.dependsOn && task.dependsOn.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {task.dependsOn.map(d => (
                                        <span key={d} className="bg-amber-100 text-amber-800 px-1.5 rounded text-xs">{d}</span>
                                    ))}
                                </div>
                            ) : <span className="text-gray-400">None</span>}
                         </dd>
                       </dl>
                    </div>

                    <div>
                       <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wider mb-2">Logic Evaluation</h4>
                       <div className="bg-gray-50 rounded p-3 text-sm">
                          {task.conditions.length === 0 ? (
                             <div className="text-gray-500 italic">No conditions (Always applies)</div>
                          ) : (
                             <ul className="space-y-2">
                               {task.conditions.map((cond, idx) => {
                                  // Re-eval specific condition for display
                                  const result = userProfile ? evaluateConditions(userProfile, [cond]) : false;
                                  return (
                                    <li key={idx} className="flex items-center justify-between">
                                       <code className="text-xs bg-gray-200 px-1 rounded">
                                          {cond.field} {cond.operator} {String(cond.value)}
                                       </code>
                                       {result ? (
                                           <CheckCircle className="w-4 h-4 text-green-500" />
                                       ) : (
                                           <XCircle className="w-4 h-4 text-gray-300" />
                                       )}
                                    </li>
                                  );
                               })}
                             </ul>
                          )}
                       </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                     <details>
                        <summary className="text-xs text-blue-600 cursor-pointer hover:underline">View Raw JSON</summary>
                        <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                           {JSON.stringify(task, null, 2)}
                        </pre>
                     </details>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TasksRegistryEditor;