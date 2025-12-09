const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  uploadIdProof,
  getUsers,
  getUser,
  verifyUserId,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite
} = require('../controllers/userController');

const router = express.Router();

const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/logout', protect, logoutUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verify-email/:verificationtoken', verifyEmail);

// Protected routes - specific routes first
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/upload-id', protect, uploadIdProof);

// Favorites routes
router.get('/favorites', protect, getFavorites);
router.get('/favorites/:propertyId', protect, checkFavorite);
router.post('/favorites/:propertyId', protect, addToFavorites);
router.delete('/favorites/:propertyId', protect, removeFromFavorites);

// Admin routes (now accessible to all authenticated users) - before dynamic routes
router.get('/', protect, getUsers);

// Dynamic routes - must come after specific routes
router.get('/:id', protect, getUser);
router.put('/:id/verify-id', protect, verifyUserId);

module.exports = router;