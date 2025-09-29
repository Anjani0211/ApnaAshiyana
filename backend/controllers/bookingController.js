const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Booking = require('../models/bookingModel');
const Property = require('../models/propertyModel');
const User = require('../models/userModel');

// @desc    Create new booking request
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  req.body.tenant = req.user.id;

  const property = await Property.findById(req.body.property);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.body.property}`, 404)
    );
  }

  // Check if property is available
  if (!property.isAvailable) {
    return next(
      new ErrorResponse(`Property is not available for booking`, 400)
    );
  }

  // Check if property is verified
  if (!property.isVerified) {
    return next(
      new ErrorResponse(`Cannot book an unverified property`, 400)
    );
  }

  // Add owner to booking
  req.body.owner = property.owner;

  // Add rent and deposit amounts
  req.body.rentAmount = property.rent;
  req.body.depositAmount = property.deposit;

  // Check if user already has a pending booking for this property
  const existingBooking = await Booking.findOne({
    property: req.body.property,
    tenant: req.user.id,
    status: 'pending'
  });

  if (existingBooking) {
    return next(
      new ErrorResponse(`You already have a pending booking for this property`, 400)
    );
  }

  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'property',
      select: 'title address images rent deposit'
    })
    .populate({
      path: 'tenant',
      select: 'name email phone'
    })
    .populate({
      path: 'owner',
      select: 'name email phone'
    });

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or property owner or admin
  if (
    booking.tenant._id.toString() !== req.user.id &&
    booking.owner._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this booking`,
        403
      )
    );
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property owner or admin
  if (
    booking.owner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this booking`,
        403
      )
    );
  }

  // Check if status is valid
  const validStatuses = ['approved', 'rejected'];
  if (!validStatuses.includes(req.body.status)) {
    return next(
      new ErrorResponse(
        `Status must be one of: ${validStatuses.join(', ')}`,
        400
      )
    );
  }

  booking.status = req.body.status;
  booking.responseMessage = req.body.responseMessage;
  booking.responseDate = Date.now();

  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.tenant.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to cancel this booking`,
        403
      )
    );
  }

  // Check if booking can be cancelled
  if (booking.status !== 'pending' && booking.status !== 'approved') {
    return next(
      new ErrorResponse(
        `Booking with status ${booking.status} cannot be cancelled`,
        400
      )
    );
  }

  booking.status = 'cancelled';
  booking.responseMessage = req.body.cancelReason || 'Cancelled by tenant';
  booking.responseDate = Date.now();

  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Get bookings for current user (tenant)
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ tenant: req.user.id })
    .populate({
      path: 'property',
      select: 'title address images rent deposit'
    })
    .populate({
      path: 'owner',
      select: 'name email phone'
    });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get booking requests for current user (owner)
// @route   GET /api/bookings/my-requests
// @access  Private
exports.getMyRequests = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ owner: req.user.id })
    .populate({
      path: 'property',
      select: 'title address images rent deposit'
    })
    .populate({
      path: 'tenant',
      select: 'name email phone'
    });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Update payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update payment status`,
        403
      )
    );
  }

  // Check if payment status is valid
  const validStatuses = ['pending', 'deposit_paid', 'rent_paid', 'refunded', 'completed'];
  if (!validStatuses.includes(req.body.paymentStatus)) {
    return next(
      new ErrorResponse(
        `Payment status must be one of: ${validStatuses.join(', ')}`,
        400
      )
    );
  }

  booking.paymentStatus = req.body.paymentStatus;
  
  // Add payment to history if provided
  if (req.body.payment) {
    booking.paymentHistory.push(req.body.payment);
  }

  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});