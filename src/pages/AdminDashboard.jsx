import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Edit2, Trash2, Copy, Eye, Plus, Search, Filter } from '@/lib/icons';
import { motion } from '@/lib/motion';
import { tasksRegistry as defaultRegistry } from '@/data/tasksRegistry';
import TaskEditor from '@/components/TaskEditor';
import TaskPreview from '@/components/TaskPreview';
import RegistryImportExport from '@/components/RegistryImportExport';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // Initialize from LS or Default
  const [registry, setRegistry] = useState(() => {
    const saved = localStorage.getItem('customRegistry');
    return saved ? JSON.parse(saved) : defaultRegistry;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingTask, setEditingTask] = useState(null); // null = none, object = edit, 'new' = create
  const [showEditor, setShowEditor] = useState(false);
  const [previewTask, setPreviewTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('customRegistry', JSON.stringify(registry));
  }, [registry]);

  const stats = {
    total: registry.length,
    categories: [...new Set(registry.map(t => t.category))].length,
    highPriority: registry.filter(t => t.priority === 'high').length,
    conditions: registry.reduce((acc, t) => acc + (t.conditions?.length || 0), 0)
  };

  const filteredTasks = registry.filter(t => {
     const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
     return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
       setRegistry(prev => prev.filter(t => t.id !== id));
       toast({ title: "Task Deleted", description: `Task ${id} removed.` });
    }
  };

  const handleDuplicate = (task) => {
    const newTask = {
       ...task,
       id: `${task.id}-copy`,
       title: `${task.title} (Copy)`,
       version: 1
    };
    setRegistry(prev => [...prev, newTask]);
    toast({ title: "Task Duplicated", description: "Created a copy of the task." });
  };

  const handleSaveTask = (taskData) => {
    if (editingTask && editingTask !== 'new' && editingTask.id !== taskData.id) {
       // ID changed? shouldn't happen due to disable, but just in case
    }

    setRegistry(prev => {
       const exists = prev.find(t => t.id === taskData.id);
       if (exists) {
          return prev.map(t => t.id === taskData.id ? taskData : t);
       } else {
          return [...prev, taskData];
       }
    });
    setShowEditor(false);
    setEditingTask(null);
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setShowEditor(true);
  };

  const startCreate = () => {
    setEditingTask(null); // passes null prop to editor
    setShowEditor(true);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
               <p className="text-gray-500">Manage task registry and system configuration</p>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={startCreate}
                 className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-teal-700 transition"
               >
                 <Plus className="w-5 h-5 mr-2" /> New Task
               </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium">Total Tasks</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium">Categories</div>
                <div className="text-3xl font-bold text-purple-600 mt-2">{stats.categories}</div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium">High Priority</div>
                <div className="text-3xl font-bold text-red-600 mt-2">{stats.highPriority}</div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium">Total Logic Rules</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">{stats.conditions}</div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Task List */}
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50">
                      <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                         <input 
                           type="text" 
                           placeholder="Search tasks..." 
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-teal-500 focus:border-teal-500"
                         />
                      </div>
                      <div className="flex items-center gap-2">
                         <Filter className="w-4 h-4 text-gray-500" />
                         <select 
                           value={categoryFilter}
                           onChange={(e) => setCategoryFilter(e.target.value)}
                           className="border rounded-lg text-sm py-2 pl-2 pr-8 focus:ring-teal-500"
                         >
                            <option value="All">All Categories</option>
                            {[...new Set(registry.map(t => t.category))].map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                   </div>

                   <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                      {filteredTasks.map(task => (
                        <motion.div 
                          key={task.id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center group"
                        >
                           <div>
                              <div className="flex items-center gap-2">
                                 <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{task.category}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                           </div>
                           
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setPreviewTask(task)} title="Preview" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                 <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => startEdit(task)} title="Edit" className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
                                 <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDuplicate(task)} title="Duplicate" className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                                 <Copy className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(task.id)} title="Delete" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Sidebar Actions */}
             <div className="space-y-6">
                <RegistryImportExport registry={registry} onImport={setRegistry} />
                
                {previewTask ? (
                   <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Task Preview</h3>
                      <TaskPreview task={previewTask} />
                   </div>
                ) : (
                   <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Hover over a task and click eye icon to preview details here</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {showEditor && (
         <TaskEditor 
            task={editingTask} 
            existingTasks={registry}
            onSave={handleSaveTask} 
            onCancel={() => setShowEditor(false)} 
         />
      )}
    </>
  );
};

export default AdminDashboard;