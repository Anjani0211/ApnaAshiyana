const multer = require('multer');

// Configure multer for memory storage (since we're using Cloudinary or file buffers)
const storage = multer.memoryStorage();

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload an image file'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_UPLOAD) || 10000000, // 10MB default (increased from 5MB)
    files: 10 // Maximum 10 files at once
  }
});

// Middleware for single or multiple property images
const uploadPropertyImages = upload.fields([
  { name: 'images', maxCount: 10 } // Allow up to 10 images
]);

module.exports = {
  upload,
  uploadPropertyImages
};
