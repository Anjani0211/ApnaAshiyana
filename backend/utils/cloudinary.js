const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

/**
 * Upload single image to Cloudinary
 * @param {String} filePath - Path to the file
 * @param {String} folder - Folder path in Cloudinary (optional)
 * @returns {Promise} Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'kirayedar/properties') => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      invalidate: true // Invalidate CDN cache
      // Don't include timestamp - SDK will auto-generate with current time
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Upload buffer directly to Cloudinary (for multer file uploads)
 * @param {Buffer} buffer - File buffer
 * @param {String} originalName - Original filename
 * @param {String} folder - Folder path in Cloudinary (optional)
 * @returns {Promise} Cloudinary upload result
 */
const uploadBufferToCloudinary = async (buffer, originalName, folder = 'kirayedar/properties') => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return reject(new Error('Cloudinary cloud name not configured'));
    }

    // Generate unique public_id with timestamp to avoid conflicts
    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${Math.random().toString(36).substring(7)}_${originalName.replace(/\.[^/.]+$/, '')}`;

    // Use upload_stream - Cloudinary SDK will automatically generate signature with current timestamp
    // Since we're using API keys configured in cloudinary.config(), no need for explicit signing
    const uploadOptions = {
      folder: folder,
      resource_type: 'image',
      public_id: `${folder}/${uniqueName}`,
      overwrite: false,
      invalidate: true // Invalidate CDN cache
    };

    // Create upload stream - SDK handles timestamp and signature automatically
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          console.error('Error details:', {
            http_code: error.http_code,
            name: error.name,
            message: error.message
          });
          
          // Provide more helpful error message
          let errorMessage = error.message;
          if (error.message && error.message.includes('Stale request')) {
            errorMessage = 'Upload request expired. Server time may be out of sync. Please try uploading again immediately.';
          } else if (error.message && (error.message.includes('time') || error.message.includes('timestamp'))) {
            errorMessage = 'Timestamp error. Please ensure server time is synchronized with UTC.';
          }
          return reject(new Error(`Cloudinary upload failed: ${errorMessage}`));
        }
        
        if (!result) {
          return reject(new Error('Cloudinary upload failed: No result returned'));
        }
        
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height
        });
      }
    );

    // Write buffer to stream immediately to avoid any delays
    uploadStream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise} Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Check if Cloudinary is configured
 * @returns {Boolean}
 */
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

module.exports = {
  uploadToCloudinary,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured,
  cloudinary
};

