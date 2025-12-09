const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModel');

// Protect routes - verifies access token server-side
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Set token from cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token || token === 'none') {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token server-side
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database - always verify from DB
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Attach user to request - always fresh from database
    req.user = user;
    next();
  } catch (err) {
    // Token expired or invalid - try refresh token
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      // Check for refresh token
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      
      if (refreshToken) {
        try {
          // Verify refresh token from database
          const hashedRefreshToken = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');
          
          const user = await User.findOne({
            refreshToken: hashedRefreshToken,
            refreshTokenExpire: { $gt: Date.now() }
          });
          
          if (user) {
            // Generate new access token
            const newToken = user.getSignedJwtToken();
            
            // Set new token in cookie
            const tokenOptions = {
              expires: new Date(
                Date.now() + (process.env.JWT_COOKIE_EXPIRE || 1) * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
              sameSite: 'strict'
            };
            
            if (process.env.NODE_ENV === 'production') {
              tokenOptions.secure = true;
            }
            
            res.cookie('token', newToken, tokenOptions);
            req.user = user;
            return next();
          }
        } catch (refreshErr) {
          console.error('Refresh token error:', refreshErr);
        }
      }
    }
    
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Check if user has paid for premium features
exports.hasPaidCheck = asyncHandler(async (req, res, next) => {
  if (!req.user.hasPaid) {
    return next(
      new ErrorResponse(
        'Payment required. Please make a payment to access this feature',
        403
      )
    );
  }
  next();
});

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

// Optional auth - sets req.user if token exists, but doesn't require it
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Set token from cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If token exists, verify and set user
  if (token && token !== 'none') {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (err) {
      // Token invalid, but continue without user
      req.user = null;
    }
  }

  next();
});