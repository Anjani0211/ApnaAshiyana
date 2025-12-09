const crypto = require('crypto');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/userModel');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Check total user count to determine if this is one of the first 5 users
  const totalUsers = await User.countDocuments();
  const isFirstFive = totalUsers < 5;
  
  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    // Auto-verify user for development
    isVerified: true,
    isIdVerified: true, // Also auto-verify ID for easier testing
    registrationOrder: totalUsers + 1,
    // First 5 users get free premium access
    hasPaid: isFirstFive,
    ...(isFirstFive && {
      paymentDate: new Date(),
      paymentId: 'first-five-free'
    })
  });

  // NOTE: Email verification disabled for development
  // Will be re-enabled in production
  // const verificationToken = user.getVerificationToken();
  // await user.save({ validateBeforeSave: false });
  // const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;
  
  // Skip email verification for now
  try {
    // No email sending in development
    
    await     await sendTokenResponse(user, 201, res, {
      message: 'User registered successfully. Your account is automatically verified for development.'
    });
  } catch (err) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  await sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookies and refresh token
// @route   GET /api/users/logout
// @access  Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
  // Clear refresh token from database
  if (req.user) {
    req.user.refreshToken = undefined;
    req.user.refreshTokenExpire = undefined;
    await req.user.save({ validateBeforeSave: false });
  }

  // Clear cookies
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'strict'
  });
  
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'strict'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Refresh access token
// @route   POST /api/users/refresh-token
// @access  Public
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    return next(new ErrorResponse('Refresh token not provided', 401));
  }

  // Hash the refresh token
  const hashedRefreshToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  // Find user with valid refresh token
  const user = await User.findOne({
    refreshToken: hashedRefreshToken,
    refreshTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired refresh token', 401));
  }

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

  res
    .cookie('token', newToken, tokenOptions)
    .status(200)
    .json({
      success: true,
      token: newToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        hasPaid: user.hasPaid,
        paymentDate: user.paymentDate,
        registrationOrder: user.registrationOrder,
        isVerified: user.isVerified,
        isIdVerified: user.isIdVerified
      }
    });
});

// @desc    Get current logged in user - always from database
// @route   GET /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // Always fetch fresh from database - never trust client state
  const user = await User.findById(req.user.id).select('-password -refreshToken');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
    user: user // Also include in user field for compatibility
  });
});

// @desc    Update user details
// @route   PUT /api/users/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/users/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  await sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  // Send email with reset URL
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Reset Your Password</h1>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 10 minutes.</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  await sendTokenResponse(user, 200, res);
});

// @desc    Verify email
// @route   GET /api/users/verify-email/:verificationtoken
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.verificationtoken)
    .digest('hex');

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set user as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  // Redirect to frontend login page with success parameter
  res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
});

// @desc    Upload ID proof for verification
// @route   PUT /api/users/upload-id
// @access  Private
exports.uploadIdProof = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.idProof) {
    return next(new ErrorResponse('Please upload an ID proof', 400));
  }

  const file = req.files.idProof;

  // Make sure the file is an image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `id_${req.user.id}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/ids/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with file upload', 500));
    }

    await User.findByIdAndUpdate(req.user.id, { idProof: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Verify user ID
// @route   PUT /api/users/:id/verify-id
// @access  Private/Admin
// @desc    Add property to favorites
// @route   POST /api/users/favorites/:propertyId
// @access  Private
exports.addToFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const propertyId = req.params.propertyId;

  if (!user.favorites.includes(propertyId)) {
    user.favorites.push(propertyId);
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: user.favorites
  });
});

// @desc    Remove property from favorites
// @route   DELETE /api/users/favorites/:propertyId
// @access  Private
exports.removeFromFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const propertyId = req.params.propertyId;

  user.favorites = user.favorites.filter(
    fav => fav.toString() !== propertyId.toString()
  );
  await user.save();

  res.status(200).json({
    success: true,
    data: user.favorites
  });
});

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('favorites');
  
  res.status(200).json({
    success: true,
    data: user.favorites || []
  });
});

// @desc    Check if property is in favorites
// @route   GET /api/users/favorites/:propertyId
// @access  Private
exports.checkFavorite = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const propertyId = req.params.propertyId;
  
  const isFavorite = user.favorites.some(
    fav => fav.toString() === propertyId.toString()
  );

  res.status(200).json({
    success: true,
    isFavorite
  });
});

exports.verifyUserId = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  if (!user.idProof) {
    return next(new ErrorResponse('User has not uploaded ID proof', 400));
  }

  user.isIdVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, additionalData = {}) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token, // Include token in response body for client-side storage
      ...additionalData
    });
};