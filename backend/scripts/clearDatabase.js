// Script to clear database
// Run with: node backend/scripts/clearDatabase.js

const mongoose = require('mongoose');
const User = require('../models/userModel');
const Property = require('../models/propertyModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kirayedar', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear all collections
    console.log('Clearing database...');
    
    await User.deleteMany({});
    console.log('✓ Users cleared');
    
    await Property.deleteMany({});
    console.log('✓ Properties cleared');
    
    await Booking.deleteMany({});
    console.log('✓ Bookings cleared');
    
    await Review.deleteMany({});
    console.log('✓ Reviews cleared');

    console.log('\n✅ Database cleared successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();

