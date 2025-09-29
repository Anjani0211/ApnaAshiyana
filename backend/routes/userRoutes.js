const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  uploadIdProof,
  getUsers,
  getUser,
  verifyUserId
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verify-email/:verificationtoken', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/upload-id', protect, uploadIdProof);

// Admin only routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id/verify-id', protect, authorize('admin'), verifyUserId);

module.exports = router;