const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  addOwnerResponse,
  likeReview,
  verifyReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', getReviews);
router.get('/:id', getReview);

// Protected routes
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/respond', protect, addOwnerResponse);
router.put('/:id/like', protect, likeReview);

// Admin only routes
router.put('/:id/verify', protect, authorize('admin'), verifyReview);

module.exports = router;