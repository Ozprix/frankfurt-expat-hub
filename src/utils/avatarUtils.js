
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

export const getAvatarResizeDimensions = (width, height, maxSize = 512) => {
  if (!width || !height || width <= maxSize && height <= maxSize) {
    return { width, height };
  }

  const scale = Math.min(maxSize / width, maxSize / height);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};

const createObjectUrlImage = (file) => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    resolve(image);
  };

  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Could not load image for compression.'));
  };

  image.src = objectUrl;
});

export const compressImage = async (file, { maxSize = 512, quality = 0.82 } = {}) => {
  if (
    typeof document === 'undefined' ||
    typeof Image === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof File === 'undefined'
  ) {
    return file;
  }

  const image = await createObjectUrlImage(file);
  const { width, height } = getAvatarResizeDimensions(image.naturalWidth, image.naturalHeight, maxSize);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return file;

  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(file);
        return;
      }

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const extension = outputType === 'image/png' ? 'png' : 'jpg';
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'avatar';
      resolve(new File([blob], `${baseName}.${extension}`, { type: outputType, lastModified: Date.now() }));
    }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
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
