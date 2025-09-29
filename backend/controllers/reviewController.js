const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Review = require('../models/reviewModel');
const Property = require('../models/propertyModel');
const Booking = require('../models/bookingModel');

// @desc    Get all reviews
// @route   GET /api/reviews
// @route   GET /api/properties/:propertyId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.propertyId) {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate({
        path: 'user',
        select: 'name'
      });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'user',
    select: 'name'
  }).populate({
    path: 'property',
    select: 'title address'
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Add review
// @route   POST /api/properties/:propertyId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.property = req.params.propertyId;
  req.body.user = req.user.id;

  const property = await Property.findById(req.params.propertyId);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.propertyId}`, 404)
    );
  }

  // Check if user has booked this property
  const booking = await Booking.findOne({
    property: req.params.propertyId,
    tenant: req.user.id,
    status: 'completed'
  });

  if (!booking && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You can only review properties you have stayed in`,
        403
      )
    );
  }

  // Check if user already reviewed this property
  const existingReview = await Review.findOne({
    property: req.params.propertyId,
    user: req.user.id
  });

  if (existingReview) {
    return next(
      new ErrorResponse(
        `You have already reviewed this property`,
        400
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this review`,
        403
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this review`,
        403
      )
    );
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add owner response to review
// @route   PUT /api/reviews/:id/respond
// @access  Private
exports.addOwnerResponse = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'property',
    select: 'owner'
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the property owner
  if (review.property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to respond to this review`,
        403
      )
    );
  }

  review.ownerResponse = {
    text: req.body.text,
    createdAt: Date.now()
  };

  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Like a review
// @route   PUT /api/reviews/:id/like
// @access  Private
exports.likeReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if the review has already been liked by this user
  if (review.likes.includes(req.user.id)) {
    // Remove like
    review.likes = review.likes.filter(
      like => like.toString() !== req.user.id
    );
  } else {
    // Add like
    review.likes.push(req.user.id);
  }

  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Verify a review
// @route   PUT /api/reviews/:id/verify
// @access  Private/Admin
exports.verifyReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  review.isVerified = true;
  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});