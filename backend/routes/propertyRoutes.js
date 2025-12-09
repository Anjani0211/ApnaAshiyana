const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  propertyImageUpload,
  getPropertiesInRadius,
  filterProperties,
  verifyProperty,
  toggleAvailability,
  getUserProperties,
  getFeaturedProperties,
  getAreaCounts,
  toggleLike
} = require('../controllers/propertyController');

const router = express.Router();

// Include other resource routers
const reviewRouter = require('./reviewRoutes');
const bookingRouter = require('./bookingRoutes');

const { protect, idVerifiedOnly, optionalAuth } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Property = require('../models/propertyModel');
const { uploadPropertyImages } = require('../utils/multer');

// Re-route into other resource routers
router.use('/:propertyId/reviews', reviewRouter);
router.use('/:propertyId/bookings', bookingRouter);

// Public routes
router.get('/', optionalAuth, advancedResults(Property, { path: 'owner', select: 'name email phone isVerified isIdVerified' }), getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/area-counts', getAreaCounts);
router.get('/filter', filterProperties);
router.get('/radius/:pincode/:distance', getPropertiesInRadius);

// Protected routes - MUST come before /:id route to avoid route conflicts
router.get('/user', protect, getUserProperties);

// Public route for single property - MUST come after all specific routes
router.get('/:id', optionalAuth, getProperty);
router.put('/:id/like', protect, toggleLike);
router.post('/', protect, idVerifiedOnly, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.put('/:id/images', protect, uploadPropertyImages, propertyImageUpload);
router.put('/:id/toggle-availability', protect, toggleAvailability);

// Property verification (can be done by owner or admin in future)
router.put('/:id/verify', protect, verifyProperty);

module.exports = router;