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

const { protect } = require('../middlewares/auth');

// Protected routes - specific routes first
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/my-requests', protect, getMyRequests);

// Admin routes (now accessible to all authenticated users) - before dynamic routes
router.get('/', protect, getBookings);

// Dynamic routes - must come after specific routes
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;