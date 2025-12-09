const express = require('express');
const {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/status', protect, getPaymentStatus);

module.exports = router;

