import React, { useState, useEffect } from 'react';
import { Save, X, Loader2 } from '@/lib/icons';
import ConditionBuilder from './ConditionBuilder';
import { useToast } from '@/components/ui/use-toast';

const TaskEditor = ({ task, onSave, onCancel, existingTasks = [] }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    category: 'Registration',
    priority: 'medium',
    estimatedDays: '',
    officialLink: '',
    version: 1,
    dependsOn: [],
    conditions: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDependsOnChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, dependsOn: selected }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.id || !formData.title) {
       toast({ title: "Validation Error", description: "ID and Title are required.", variant: "destructive" });
       setLoading(false);
       return;
    }

    // Simulate API call
    setTimeout(() => {
       onSave(formData);
       toast({ title: "Task Saved", description: "Registry has been updated successfully." });
       setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Task ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    disabled={!!task} // Disable ID edit for existing
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Version</label>
                  <input
                    type="number"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                  />
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700">Title</label>
               <input
                 type="text"
                 name="title"
                 value={formData.title}
                 onChange={handleChange}
                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700">Description</label>
               <textarea
                 name="description"
                 rows="3"
                 value={formData.description}
                 onChange={handleChange}
                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 bg-white"
                  >
                     <option value="Registration">Registration</option>
                     <option value="Immigration">Immigration</option>
                     <option value="Health">Health</option>
                     <option value="Finance">Finance</option>
                     <option value="Other">Other</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 bg-white"
                  >
                     <option value="low">Low</option>
                     <option value="medium">Medium</option>
                     <option value="high">High</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Est. Days</label>
                  <input
                    type="number"
                    name="estimatedDays"
                    value={formData.estimatedDays}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Official Link</label>
                  <input
                    type="url"
                    name="officialLink"
                    value={formData.officialLink}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                  />
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Dependencies (Hold Ctrl/Cmd to select multiple)</label>
               <select
                 multiple
                 name="dependsOn"
                 value={formData.dependsOn}
                 onChange={handleDependsOnChange}
                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 h-24"
               >
                 {existingTasks
                   .filter(t => t.id !== formData.id) // Don't allow depending on self
                   .map(t => (
                   <option key={t.id} value={t.id}>{t.title} ({t.id})</option>
                 ))}
               </select>
            </div>

            <div className="border-t pt-4">
               <ConditionBuilder 
                  conditions={formData.conditions} 
                  onChange={(newConds) => setFormData(prev => ({ ...prev, conditions: newConds }))}
               />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditor;