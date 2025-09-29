const path = require('path');
const ErrorResponse = require('./errorResponse');

/**
 * File upload utility
 * @param {Object} file - File object from request
 * @param {String} uploadPath - Path to upload directory
 * @param {Array} allowedTypes - Array of allowed file types
 * @param {Number} maxSize - Maximum file size in bytes
 * @returns {String} - File name
 */
exports.uploadFile = (file, uploadPath, allowedTypes, maxSize) => {
  return new Promise((resolve, reject) => {
    // Check if file exists
    if (!file) {
      return reject(new ErrorResponse('Please upload a file', 400));
    }

    // Check file type
    const fileExt = path.extname(file.name).toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      return reject(
        new ErrorResponse(
          `Please upload a valid file. Allowed types: ${allowedTypes.join(', ')}`,
          400
        )
      );
    }

    // Check file size
    if (file.size > maxSize) {
      return reject(
        new ErrorResponse(
          `Please upload a file less than ${maxSize / 1000000} MB`,
          400
        )
      );
    }

    // Create custom filename
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;

    // Move file to upload path
    file.mv(`${uploadPath}/${fileName}`, err => {
      if (err) {
        console.error(err);
        return reject(new ErrorResponse('File upload failed', 500));
      }

      resolve(fileName);
    });
  });
};

/**
 * Multiple files upload utility
 * @param {Array} files - Array of file objects from request
 * @param {String} uploadPath - Path to upload directory
 * @param {Array} allowedTypes - Array of allowed file types
 * @param {Number} maxSize - Maximum file size in bytes
 * @param {Number} maxFiles - Maximum number of files
 * @returns {Array} - Array of file names
 */
exports.uploadMultipleFiles = (files, uploadPath, allowedTypes, maxSize, maxFiles) => {
  return new Promise((resolve, reject) => {
    // Check if files exist
    if (!files) {
      return reject(new ErrorResponse('Please upload files', 400));
    }

    // Convert to array if single file
    let fileArray = files;
    if (!Array.isArray(files)) {
      fileArray = [files];
    }

    // Check number of files
    if (fileArray.length > maxFiles) {
      return reject(
        new ErrorResponse(
          `Please upload no more than ${maxFiles} files`,
          400
        )
      );
    }

    // Process each file
    const uploadPromises = fileArray.map(file => {
      return this.uploadFile(file, uploadPath, allowedTypes, maxSize);
    });

    // Wait for all uploads to complete
    Promise.all(uploadPromises)
      .then(fileNames => {
        resolve(fileNames);
      })
      .catch(err => {
        reject(err);
      });
  });
};