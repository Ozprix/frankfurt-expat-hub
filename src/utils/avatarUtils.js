
/**
 * Avatar image processing utilities
 */

export const validateImageFile = (file) => {
  if (!file) return { isValid: false, error: 'No file selected' };

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Please use JPG, PNG, or WebP.' };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large. Max size is 5MB.' };
  }

  return { isValid: true };
};

export const compressImage = async (file) => {
  // Basic mock compression - in a real app, use a canvas or library like browser-image-compression
  // This just returns the file as-is for now but preserves the async interface
  return new Promise((resolve) => {
    setTimeout(() => resolve(file), 100);
  });
};

export const generateAvatarUrl = (path, bucketName = 'avatars') => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  // Using import.meta.env for Vite compatibility
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${path}`;
};

export const deleteAvatarFile = async (path, supabaseClient) => {
  if (!path || !supabaseClient) return;
  const { error } = await supabaseClient.storage.from('avatars').remove([path]);
  if (error) throw error;
  return true;
};
