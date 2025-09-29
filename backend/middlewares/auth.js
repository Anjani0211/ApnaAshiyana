const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModel');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token from Authorization header:', token);
  } 
  // Set token from cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token from cookie:', token);
  }

  // Make sure token exists
  if (!token || token === 'none') {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Add user to request object
    req.user = await User.findById(decoded.id);
    console.log('Found user:', req.user ? req.user._id : 'No user found');

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Verify user is verified
exports.verifiedOnly = asyncHandler(async (req, res, next) => {
  if (!req.user.isVerified) {
    return next(
      new ErrorResponse(
        'Email verification required. Please verify your email to access this route',
        403
      )
    );
  }
  next();
});

// Verify user ID is verified for property listing
exports.idVerifiedOnly = asyncHandler(async (req, res, next) => {
  if (!req.user.isIdVerified) {
    return next(
      new ErrorResponse(
        'ID verification required. Please verify your ID to list properties',
        403
      )
    );
  }
  next();
});