const express = require('express');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getMyBookings,
  getMyRequests,
  updatePaymentStatus
} = require('../controllers/bookingController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middlewares/auth');

// Protected routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/my-requests', protect, getMyRequests);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

// Admin only routes
router.get('/', protect, authorize('admin'), getBookings);
router.put('/:id/payment', protect, authorize('admin'), updatePaymentStatus);

module.exports = router;