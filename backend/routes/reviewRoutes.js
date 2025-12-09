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

const { protect } = require('../middlewares/auth');

// Public routes
router.get('/', getReviews);
router.get('/:id', getReview);

// Protected routes
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/respond', protect, addOwnerResponse);
router.put('/:id/like', protect, likeReview);

// Admin routes (now accessible to all authenticated users)
router.put('/:id/verify', protect, verifyReview);

module.exports = router;