const express = require('express');
const router = express.Router();

// Import route files
const userRoutes = require('./userRoutes');
const propertyRoutes = require('./propertyRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');

// Mount routers
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;