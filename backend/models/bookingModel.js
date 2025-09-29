const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  moveInDate: {
    type: Date,
    required: [true, 'Please provide expected move-in date']
  },
  duration: {
    type: Number, // Duration in months
    required: [true, 'Please provide rental duration in months']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  rentAmount: {
    type: Number,
    required: true
  },
  depositAmount: {
    type: Number,
    required: true
  },
  responseMessage: {
    type: String,
    maxlength: [500, 'Response message cannot be more than 500 characters']
  },
  responseDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  agreementSigned: {
    type: Boolean,
    default: false
  },
  agreementDocument: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'deposit_paid', 'rent_paid', 'refunded', 'completed'],
    default: 'pending'
  },
  paymentHistory: [
    {
      amount: Number,
      type: {
        type: String,
        enum: ['deposit', 'rent', 'refund']
      },
      date: {
        type: Date,
        default: Date.now
      },
      transactionId: String,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
      }
    }
  ]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent user from submitting more than one booking request for the same property
BookingSchema.index({ property: 1, tenant: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

module.exports = mongoose.model('Booking', BookingSchema);