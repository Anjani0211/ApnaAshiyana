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
  toggleAvailability
} = require('../controllers/propertyController');

const router = express.Router();

// Include other resource routers
const reviewRouter = require('./reviewRoutes');
const bookingRouter = require('./bookingRoutes');

const { protect, authorize, idVerifiedOnly } = require('../middlewares/auth');

// Re-route into other resource routers
router.use('/:propertyId/reviews', reviewRouter);
router.use('/:propertyId/bookings', bookingRouter);

// Public routes
router.get('/', getProperties);
router.get('/:id', getProperty);
router.get('/radius/:pincode/:distance', getPropertiesInRadius);
router.get('/filter', filterProperties);

// Protected routes
router.post('/', protect, idVerifiedOnly, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.put('/:id/images', protect, propertyImageUpload);
router.put('/:id/toggle-availability', protect, toggleAvailability);

// Admin only routes
router.put('/:id/verify', protect, authorize('admin'), verifyProperty);

module.exports = router;