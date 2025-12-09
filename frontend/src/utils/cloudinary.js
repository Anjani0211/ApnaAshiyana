// Cloudinary utility for image uploads
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'kirayedar';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
// Support direct URL or construct from cloud name
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL || 
                       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (file) => {
  try {
    // Validate Cloudinary configuration
    // Check if URL is directly provided, otherwise check cloud name
    const hasDirectUrl = import.meta.env.VITE_CLOUDINARY_URL && 
                         import.meta.env.VITE_CLOUDINARY_URL !== '' &&
                         import.meta.env.VITE_CLOUDINARY_URL.includes('cloudinary.com');
    
    if (!hasDirectUrl) {
      if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'your-cloud-name') {
        throw new Error('Cloudinary cloud name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_URL in your .env file.');
      }
    }

    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === 'your-preset') {
      throw new Error('Cloudinary upload preset not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.');
    }

    // Validate file
    if (!file || !(file instanceof File || file instanceof Blob)) {
      throw new Error('Invalid file provided');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'kirayedar/properties'); // Organize in folder
    // Add timestamp to avoid stale request errors
    formData.append('timestamp', Math.floor(Date.now() / 1000).toString());

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      // Add cache control headers
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Upload failed with status ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error('Upload succeeded but no URL returned from Cloudinary');
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Re-throw with better error message
    if (error.message) {
      throw error;
    }
    throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
  }
};

export const uploadMultipleToCloudinary = async (files) => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    // Note: This requires server-side implementation with API secret
    // For now, images will be managed through Cloudinary dashboard
    console.log('Delete not implemented - use Cloudinary dashboard or backend API');
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

