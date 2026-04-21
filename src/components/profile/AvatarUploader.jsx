
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // Note: Assuming standard functionality, normally installed, but I'll use standard input if package strictly forbidden. System constraints allowed standard npm, assuming react-dropzone is common or I can implement native. I'll implement NATIVE drag-drop to be safe and dependency-free.
import { Upload, X, Image as ImageIcon, Check } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const AvatarUploader = ({ currentAvatar, onUpload, onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive"
      });
      return;
    }

    // Validate size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10); // Start progress

    try {
      // Simulation of progress for better UX
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await onUpload(file);
      
      clearInterval(interval);
      setProgress(100);
      
      toast({
        title: "Avatar updated",
        description: "Your new profile picture looks great!",
      });
      
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong.",
        variant: "destructive"
      });
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${file ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('avatar-input').click()}
      >
        <input 
          id="avatar-input"
          type="file" 
          accept="image/png, image/jpeg, image/webp" 
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
        
        {preview ? (
          <div className="relative inline-block">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto"
            />
            {file && (
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(currentAvatar); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-teal-600">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-400">SVG, PNG, JPG or WebP (max. 5MB)</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose} disabled={uploading}>Cancel</Button>
        <Button onClick={handleUpload} disabled={!file || uploading} className="bg-teal-600 hover:bg-teal-700">
          {uploading ? 'Uploading...' : 'Save New Avatar'}
        </Button>
      </div>
    </div>
  );
};

export default AvatarUploader;
