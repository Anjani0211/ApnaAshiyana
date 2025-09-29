const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  propertyType: {
    type: String,
    required: [true, 'Please select property type'],
    enum: ['room', 'flat', 'house', 'hostel', 'pg']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['student', 'family', 'shared', 'entire']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    area: {
      type: String,
      required: [true, 'Please select an area in Ranchi'],
      enum: [
        'mesra', 'morabadi', 'bariatu', 'kanke', 'lalpur', 'harmu',
        'doranda', 'hindpiri', 'kadru', 'ratu-road', 'main-road', 'hec',
        'kokar', 'namkum', 'tatisilwai', 'bundu', 'angara', 'ormanjhi'
      ]
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      default: 'Ranchi'
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      default: 'Jharkhand'
    },
    pincode: {
      type: String,
      required: [true, 'Please add a pincode'],
      match: [/^83[0-9]{4}$/, 'Please add a valid Ranchi pincode (83xxxx)']
    },
    landmark: String
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  nearbyPlaces: {
    colleges: {
      type: [String],
      enum: [
        'BIT Mesra', 'Ranchi University', 'XLRI Jamshedpur', 'NIT Jamshedpur',
        'Ranchi College', 'St. Xavier\'s College', 'Marwari College',
        'Gossner College', 'Doranda College', 'Women\'s College'
      ]
    },
    hospitals: {
      type: [String],
      enum: [
        'RIMS', 'Raj Hospital', 'Medanta', 'Apollo Hospital',
        'Brahmanand Narain Singh Hospital', 'Central Hospital'
      ]
    },
    busStops: [String],
    markets: {
      type: [String],
      enum: [
        'Main Road Market', 'Firayalal Market', 'Khadgarha Market',
        'Upper Bazaar', 'Lower Bazaar', 'Harmu Market'
      ]
    },
    landmarks: {
      type: [String],
      enum: [
        'Ranchi Railway Station', 'Birsa Munda Airport', 'Tagore Hill',
        'Rock Garden', 'Kanke Dam', 'Pahari Mandir', 'Jagannath Temple'
      ]
    }
  },
  rent: {
    type: Number,
    required: [true, 'Please add monthly rent amount']
  },
  deposit: {
    type: Number,
    required: [true, 'Please add security deposit amount']
  },
  availableFrom: {
    type: Date,
    required: [true, 'Please add availability date'],
    default: Date.now
  },
  furnishingStatus: {
    type: String,
    required: true,
    enum: ['unfurnished', 'semi-furnished', 'fully-furnished']
  },
  furnishingDetails: {
    beds: Number,
    wardrobes: Number,
    tables: Number,
    chairs: Number,
    fans: Number,
    ac: Boolean,
    tv: Boolean,
    refrigerator: Boolean,
    washingMachine: Boolean,
    waterHeater: Boolean
  },
  amenities: {
    parking: Boolean,
    lift: Boolean,
    security: Boolean,
    powerBackup: Boolean,
    wifi: Boolean,
    waterSupply: {
      type: String,
      enum: ['24x7', 'limited', 'tanker']
    },
    kitchen: Boolean,
    bathroom: {
      type: String,
      enum: ['attached', 'shared', 'common']
    },
    balcony: Boolean
  },
  rules: {
    nonVeg: Boolean,
    drinking: Boolean,
    smoking: Boolean,
    parties: Boolean,
    pets: Boolean,
    guestAllowed: Boolean,
    girlsOnly: Boolean,
    boysOnly: Boolean,
    familyOnly: Boolean,
    studentsOnly: Boolean
  },
  images: [
    {
      type: String,
      required: [true, 'Please add at least one image']
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Geocode & create location field
PropertySchema.pre('save', async function(next) {
  if (!this.isModified('address')) {
    next();
  }
  
  try {
    const fullAddress = `${this.address.street}, ${this.address.area}, ${this.address.city}, ${this.address.state} ${this.address.pincode}`;
    const loc = await geocoder.geocode(fullAddress);
    
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    };
    
    // Set default coordinates for Ranchi if geocoding fails
    if (!this.location.coordinates || this.location.coordinates.length !== 2) {
      // Default to Ranchi center coordinates
      this.location = {
        type: 'Point',
        coordinates: [85.3096, 23.3441], // Ranchi coordinates
        formattedAddress: `${this.address.area}, Ranchi, Jharkhand`
      };
    }
  } catch (err) {
    console.error('Geocoding error:', err);
    // Set default Ranchi coordinates
    this.location = {
      type: 'Point',
      coordinates: [85.3096, 23.3441],
      formattedAddress: `${this.address.area}, Ranchi, Jharkhand`
    };
  }
  
  next();
});

// Reverse populate with reviews
PropertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

// Cascade delete reviews when a property is deleted
PropertySchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ property: this._id });
  next();
});

module.exports = mongoose.model('Property', PropertySchema);