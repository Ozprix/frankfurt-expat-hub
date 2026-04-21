import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from '@/lib/motion';
import { Filter, Plus, Trash2, CheckCircle, ExternalLink, Lock, AlertCircle, Clock, Crown } from '@/lib/icons';
import { usePlan } from '@/hooks/usePlan';
import { useToast } from '@/components/ui/use-toast';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { getProgressPercentage } from '@/utils/planGenerationLogic';
import { Link } from 'react-router-dom';

const PlanPage = () => {
  const { tasks, toggleTaskStatus, deleteTask, addTask } = usePlan();
  const { toast } = useToast();
  const { incrementTasksCreated } = useUsageTracking();
  
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', category: '', dueDate: '' });

  const categories = ['All', ...new Set(tasks.map(t => t.category))];
  const cleanCategories = categories.filter(c => c);

  const filteredTasks = tasks.filter(task => {
    return categoryFilter === 'All' || task.category === categoryFilter;
  });

  const progress = getProgressPercentage(tasks);

  const isTaskBlocked = (task) => {
    if (!task.dependsOn || task.dependsOn.length === 0) return false;
    return task.dependsOn.some(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask && depTask.status !== 'completed';
    });
  };

  const isOverLimit = false;

  const handleAddTask = async () => {
    if (isOverLimit) {
        toast({ title: "Beta Access Active", description: "Task limits are paused while paid checkout is disabled." });
        return;
    }

    if (!newTask.title || !newTask.category || !newTask.dueDate) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    // Increment Usage in DB
    try {
        await incrementTasksCreated();
        addTask({
          ...newTask,
          priority: 'medium',
          officialLink: '',
          status: 'pending',
          dependsOn: [],
          conditions: []
        });

        toast({ title: "✅ Task Added", description: "Your custom task has been added to the plan" });
        setNewTask({ title: '', description: '', category: '', dueDate: '' });
        setShowAddModal(false);
    } catch (e) {
        toast({ title: "Error", description: "Failed to track usage.", variant: "destructive" });
    }
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
    <>
      <Helmet>
        <title>Your Plan | Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Personalized Relocation Plan</h1>
            <p className="text-lg text-gray-600">Track your progress and manage all relocation tasks</p>
          </div>

          {/* Progress */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
              <span className="text-3xl font-bold text-teal-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-4 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </motion.div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <div className="flex gap-2 flex-wrap">
                  {cleanCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm ${categoryFilter === cat ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {filteredTasks.map((task, index) => {
              const blocked = isTaskBlocked(task);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${blocked ? 'border-gray-300 bg-gray-50' : task.status === 'completed' ? 'border-green-500' : 'border-teal-600'}`}
                >
                  <div className="flex items-start gap-4">
                    <button onClick={() => !blocked && toggleTaskStatus(task.id)} disabled={blocked} className="flex-shrink-0 mt-1">
                      {blocked ? <Lock className="w-6 h-6 text-gray-400" /> : <CheckCircle className={`w-6 h-6 ${task.status === 'completed' ? 'text-green-600 fill-green-600' : 'text-gray-300 hover:text-teal-600'}`} />}
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</h3>
                        <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <p className="text-gray-600 mt-1">{task.description}</p>
                      {blocked && <div className="mt-2 text-sm text-amber-800 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Prerequisite tasks pending</div>}
                      <div className="flex gap-2 mt-3">
                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>{task.category}</span>
                         {task.dueDate && <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center"><Clock className="w-3 h-3 mr-1"/>{new Date(task.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Add Task Modal with Gating */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                {isOverLimit ? (
                    <div className="text-center">
                        <Crown className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Usage Limit Reached</h3>
                        <p className="text-gray-600 mb-6">
                            Task limits are paused while paid checkout is disabled.
                        </p>
                        <div className="space-y-3">
                            <Link to="/directory" className="block w-full py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700">
                                Browse Vetted Services
                            </Link>
                            <button onClick={() => setShowAddModal(false)} className="block w-full py-3 text-gray-500 hover:text-gray-700">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Custom Task</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                placeholder="Task title"
                            />
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                placeholder="Description"
                            />
                            <select
                                value={newTask.category}
                                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            >
                                <option value="">Category</option>
                                <option value="Other">Other</option>
                                <option value="Registration">Registration</option>
                            </select>
                            <input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg">Cancel</button>
                            <button onClick={handleAddTask} className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg">Add Task</button>
                        </div>
                    </>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlanPage;
