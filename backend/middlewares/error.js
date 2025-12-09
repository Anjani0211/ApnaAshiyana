const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value entered: ${field} with value: ${value}. Please use another value.`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new ErrorResponse('File size too large', 400);
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      error = new ErrorResponse('Too many files uploaded', 400);
    } else {
      error = new ErrorResponse(err.message || 'File upload error', 400);
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse('Token expired. Please log in again.', 401);
  }

  // Log full error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: err.stack,
      originalError: err
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    message: error.message || 'Server Error', // Also include as message for consistency
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;