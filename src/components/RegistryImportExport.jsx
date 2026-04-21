import React, { useRef } from 'react';
import { Download, Upload, AlertTriangle, FileJson } from '@/lib/icons';
import { useToast } from '@/components/ui/use-toast';

const RegistryImportExport = ({ registry, onImport }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registry, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `frankfurt_tasks_registry_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Export Successful", description: "Registry JSON has been downloaded." });
  };

  const handleImportClick = () => {
    if (confirm("Warning: Importing will overwrite your current task registry. Continue?")) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json)) {
           onImport(json);
           toast({ title: "Import Successful", description: `${json.length} tasks loaded.` });
        } else {
           throw new Error("Invalid format");
        }
      } catch (err) {
        toast({ title: "Import Failed", description: "Invalid JSON file.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
       <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
             <FileJson className="w-5 h-5 mr-2 text-gray-500" />
             Registry Backup & Restore
          </h3>
       </div>
       
       <div className="flex gap-4">
          <button
             onClick={handleExport}
             className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
             <Download className="w-4 h-4 mr-2" /> Export JSON
          </button>
          
          <button
             onClick={handleImportClick}
             className="flex-1 flex items-center justify-center px-4 py-2 border border-teal-600 rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-teal-50"
          >
             <Upload className="w-4 h-4 mr-2" /> Import JSON
          </button>
          <input
             type="file"
             ref={fileInputRef}
             className="hidden"
             accept=".json"
             onChange={handleFileChange}
          />
       </div>

       <div className="mt-4 p-3 bg-amber-50 rounded text-xs text-amber-800 flex items-start">
          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
          Always export a backup before importing external files or making major changes.
       </div>
    </div>
  );
};

export default RegistryImportExport;