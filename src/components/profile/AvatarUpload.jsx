
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from '@/lib/icons';
import { useToast } from '@/components/ui/use-toast';
import { validateImageFile } from '@/utils/avatarUtils';

const AvatarUpload = ({ currentAvatarUrl, onUpload, onRemove, loading = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid Image",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Trigger upload
    if (onUpload) {
      onUpload(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onRemove) onRemove();
  };

  const displayUrl = preview || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className={`relative group cursor-pointer rounded-full transition-all duration-300 ${isDragging ? 'ring-4 ring-teal-400 scale-105' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-20">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          ) : null}
          
          {displayUrl ? (
            <img 
              src={displayUrl} 
              alt="Profile Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <Camera className="w-10 h-10" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
            <Upload className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all" />
          </div>
        </div>

        {/* Status Badge */}
        {displayUrl && (
           <button 
             onClick={(e) => {
               e.stopPropagation();
               handleRemove();
             }}
             className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors z-30"
             title="Remove photo"
           >
             <X className="w-4 h-4" />
           </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">Profile Photo</p>
        <p className="text-xs text-gray-500 mt-1">
          Drag & drop or click to upload<br/>
          JPG, PNG or WebP (max 5MB)
        </p>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default AvatarUpload;
