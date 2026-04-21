import React from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { X, Download, Plus, Check, Clock, FileText } from '@/lib/icons';

const TemplatePreviewModal = ({ template, isOpen, onClose, onImport, onDownload }) => {
  if (!isOpen || !template) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-500 flex justify-between items-start shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-2 py-1 bg-white/20 rounded-md text-white text-xs font-bold uppercase tracking-wider">
                   {template.category}
                 </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{template.title}</h2>
              <p className="text-teal-50 mt-1">{template.description}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="bg-gray-50 border-b px-6 py-3 flex gap-6 shrink-0">
             <div className="flex items-center text-sm text-gray-600">
               <FileText className="w-4 h-4 mr-2 text-teal-600" />
               <span className="font-semibold text-gray-900 mr-1">{template.tasks?.length || 0}</span> Tasks
             </div>
             <div className="flex items-center text-sm text-gray-600">
               <Clock className="w-4 h-4 mr-2 text-teal-600" />
               <span>Est. Time: <span className="font-semibold text-gray-900">~2 weeks</span></span>
             </div>
          </div>

          {/* Task List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Included Tasks</h3>
            {template.tasks.map((task, idx) => (
              <div key={idx} className="flex items-start p-3 bg-white border rounded-lg hover:border-teal-200 transition-colors">
                <div className="mt-0.5 mr-3 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-gray-500 font-bold">{idx + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer - Actions */}
          <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onDownload(template)}
              className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => onImport(template)}
              className="flex-1 flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Import to My Plan
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TemplatePreviewModal;