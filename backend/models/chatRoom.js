const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

ChatRoomSchema.index({ property: 1, renter: 1 }, { unique: true });

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);

