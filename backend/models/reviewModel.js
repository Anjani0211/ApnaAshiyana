const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the review'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
    maxlength: [500, 'Review cannot be more than 500 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  stayDuration: {
    type: Number, // Duration in months
    required: [true, 'Please provide your stay duration']
  },
  pros: [String],
  cons: [String],
  photos: [String],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  ownerResponse: {
    text: String,
    createdAt: {
      type: Date
    }
  }
});

// Prevent user from submitting more than one review per property
ReviewSchema.index({ property: 1, user: 1 }, { unique: true });

// Static method to get average rating and update property
ReviewSchema.statics.getAverageRating = async function(propertyId) {
  const obj = await this.aggregate([
    {
      $match: { property: propertyId }
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await this.model('Property').findByIdAndUpdate(propertyId, {
        ratings: obj[0].averageRating.toFixed(1),
        numReviews: obj[0].numReviews
      });
    } else {
      await this.model('Property').findByIdAndUpdate(propertyId, {
        ratings: 0,
        numReviews: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.property);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.property);
});

module.exports = mongoose.model('Review', ReviewSchema);