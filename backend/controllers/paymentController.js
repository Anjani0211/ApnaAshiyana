const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/userModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay (only if keys are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  // Trim whitespace and check for placeholder values
  const keyId = process.env.RAZORPAY_KEY_ID.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET.trim();
  
  const isPlaceholder = keySecret === 'your_razorpay_secret_key_here' || 
                       keySecret === 'your_actual_secret_key_here' ||
                       keySecret.length < 10; // Secret keys should be longer
  
  if (!isPlaceholder) {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('Razorpay initialized with Key ID:', keyId.substring(0, 10) + '...');
  } else {
    console.warn('Razorpay not initialized: Secret key appears to be a placeholder');
  }
}

// @desc    Create payment order
// @route   POST /api/payment/create-order
// @access  Private
exports.createPaymentOrder = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if user already paid
    if (user.hasPaid) {
      return res.status(200).json({
        success: true,
        alreadyPaid: true,
        message: 'User already has premium access'
      });
    }

    // Check if Razorpay is configured
    if (!razorpay) {
      console.error('Razorpay not initialized. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env');
      console.error('Current RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? `Set (${process.env.RAZORPAY_KEY_ID.substring(0, 10)}...)` : 'Missing');
      console.error('Current RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? `Set (${process.env.RAZORPAY_KEY_SECRET.substring(0, 10)}...)` : 'Missing');
      console.error('NOTE: If you just updated .env file, please RESTART the backend server for changes to take effect!');
      return next(new ErrorResponse('Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env file and RESTART the server.', 500));
    }

    // Double check keys are set
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    
    if (!keyId || !keySecret) {
      console.error('Razorpay environment variables missing');
      console.error('RAZORPAY_KEY_ID:', keyId ? `Set (${keyId.substring(0, 10)}...)` : 'Missing');
      console.error('RAZORPAY_KEY_SECRET:', keySecret ? `Set (${keySecret.substring(0, 10)}...)` : 'Missing');
      console.error('NOTE: If you just updated .env file, please RESTART the backend server for changes to take effect!');
      return next(new ErrorResponse('Payment gateway configuration incomplete. Please add both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env file and RESTART the server.', 500));
    }

    // Amount in paise (₹199 = 19900 paise)
    const amount = 19900; // ₹199 for premium access

    // Generate receipt (max 40 chars for Razorpay)
    // Format: rec_<userId_last8chars>_<timestamp_last8chars> = max 3+1+8+1+8 = 21 chars
    const userIdShort = user._id.toString().slice(-8);
    const timestampShort = Date.now().toString().slice(-8);
    const receipt = `rec_${userIdShort}_${timestampShort}`; // Max 21 chars

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: receipt,
      notes: {
        userId: user._id.toString(),
        email: user.email
      }
    };

    console.log('Creating Razorpay order with options:', { ...options, notes: options.notes });

    const order = await razorpay.orders.create(options);

    console.log('Razorpay order created successfully:', order.id);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      key: process.env.RAZORPAY_KEY_ID,
      amount: amount
    });
  } catch (error) {
    console.error('Error in createPaymentOrder:', error);
    console.error('Error stack:', error.stack);
    
    // Handle Razorpay specific errors
    if (error.error) {
      const errorMessage = error.error.description || error.error.reason || error.message || 'Error creating payment order';
      console.error('Razorpay error details:', error.error);
      
      // Check if it's an authentication error (401)
      if (error.statusCode === 401 || (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description === 'Authentication failed')) {
        const hasKeyId = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== '';
        const hasKeySecret = process.env.RAZORPAY_KEY_SECRET && 
                            process.env.RAZORPAY_KEY_SECRET !== 'your_razorpay_secret_key_here' &&
                            process.env.RAZORPAY_KEY_SECRET !== 'your_actual_secret_key_here';
        
        console.error('Razorpay Configuration Check:');
        console.error('- RAZORPAY_KEY_ID:', hasKeyId ? 'Set' : 'Missing');
        console.error('- RAZORPAY_KEY_SECRET:', hasKeySecret ? 'Set' : 'Missing or placeholder');
        
        if (!hasKeySecret) {
          return next(new ErrorResponse('Payment gateway authentication failed. Please set RAZORPAY_KEY_SECRET in backend/.env file with your actual Razorpay secret key (not the placeholder).', 500));
        }
        
        return next(new ErrorResponse(`Payment gateway authentication failed. Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env file are correct. Error: ${errorMessage}`, 500));
      }
      
      return next(new ErrorResponse(`Payment gateway error: ${errorMessage}`, 500));
    }
    
    // Handle other errors
    const errorMessage = error.message || 'Error creating payment order';
    return next(new ErrorResponse(`Payment error: ${errorMessage}`, 500));
  }
});

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const { orderId, paymentId, signature } = req.body;

  if (!orderId || !paymentId || !signature) {
    return next(new ErrorResponse('Missing payment verification data', 400));
  }

  // Check if Razorpay is configured
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return next(new ErrorResponse('Payment gateway not configured', 500));
  }

  // Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (generatedSignature !== signature) {
    return next(new ErrorResponse('Invalid payment signature', 400));
  }

  // Update user payment status
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  user.hasPaid = true;
  user.paymentDate = new Date();
  user.paymentId = paymentId;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    data: {
      hasPaid: true,
      paymentDate: user.paymentDate,
      paymentId: user.paymentId
    },
    hasPaid: true // Also include at root for compatibility
  });
});

// @desc    Get payment status - always from database
// @route   GET /api/payment/status
// @access  Private
exports.getPaymentStatus = asyncHandler(async (req, res, next) => {
  // Always fetch fresh from database - never trust client state
  const user = await User.findById(req.user.id).select('hasPaid paymentDate paymentId registrationOrder');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      hasPaid: user.hasPaid || false,
      paymentDate: user.paymentDate,
      paymentId: user.paymentId,
      registrationOrder: user.registrationOrder
    },
    hasPaid: user.hasPaid || false // Also include at root for compatibility
  });
});

