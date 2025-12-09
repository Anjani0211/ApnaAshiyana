const ChatRoom = require('../models/chatRoom');
const ChatMessage = require('../models/chatMessage');
const Property = require('../models/propertyModel');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// Ensure or create room for a renter and property
exports.ensureRoom = asyncHandler(async (req, res, next) => {
  const { propertyId } = req.params;
  const renterId = req.user.id;

  const property = await Property.findById(propertyId).select('owner title');
  if (!property) {
    return next(new ErrorResponse('Property not found', 404));
  }

  const ownerId = property.owner;

  // Find or create room
  // For owner view, renterId might be different; ensure uniqueness by property + renter
  let room = await ChatRoom.findOne({ property: propertyId, renter: renterId });
  if (!room) {
    room = await ChatRoom.create({
      property: propertyId,
      renter: renterId,
      owner: ownerId
    });
  }

  res.json({
    success: true,
    data: {
      roomId: room._id,
      propertyId,
      ownerId,
      renterId,
      propertyTitle: property.title || 'Property',
      owner: { _id: room.owner },
      renter: { _id: room.renter }
    }
  });
});

// Get messages for a room
exports.getMessages = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50;
  const before = req.query.before ? new Date(req.query.before) : null;

  const room = await ChatRoom.findById(roomId);
  if (!room) return next(new ErrorResponse('Room not found', 404));

  // Authorization: must be owner or renter
  if (room.owner.toString() !== req.user.id && room.renter.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized for this room', 403));
  }

  const filter = { room: roomId };
  if (before) {
    filter.createdAt = { $lt: before };
  }

  const messages = await ChatMessage.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({
    success: true,
    data: messages.reverse(), // newest last
    hasMore: messages.length === limit
  });
});

// List rooms for current user with last message and unread count
exports.listRooms = asyncHandler(async (req, res, next) => {
  const filter = req.query.filter || 'all'; // all | renter | owner
  const userId = req.user.id;

  const match = {};
  if (filter === 'renter') {
    match.renter = userId;
  } else if (filter === 'owner') {
    match.owner = userId;
  } else {
    match.$or = [{ owner: userId }, { renter: userId }];
  }

  const rooms = await ChatRoom.find(match)
    .populate('property', 'title')
    .populate('owner', 'name email')
    .populate('renter', 'name email')
    .lean();

  const roomIds = rooms.map(r => r._id);
  const lastMessages = await ChatMessage.aggregate([
    { $match: { room: { $in: roomIds } } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$room',
        lastMessage: { $first: '$$ROOT' }
      }
    }
  ]);

  const unreadCounts = await ChatMessage.aggregate([
    { $match: { room: { $in: roomIds }, read: false, sender: { $ne: userId } } },
    { $group: { _id: '$room', count: { $sum: 1 } } }
  ]);

  const lastMap = Object.fromEntries(lastMessages.map(m => [String(m._id), m.lastMessage]));
  const unreadMap = Object.fromEntries(unreadCounts.map(u => [String(u._id), u.count]));

  const result = rooms.map(r => {
    const last = lastMap[String(r._id)];
    return {
      roomId: r._id,
      propertyId: r.property?._id,
      propertyTitle: r.property?.title,
      owner: r.owner,
      renter: r.renter,
      lastMessage: last ? {
        text: last.text,
        sender: last.sender,
        time: last.createdAt
      } : null,
      unread: unreadMap[String(r._id)] || 0
    };
  });

  // Deduplicate by property + other user (relative to current user), keep most recent
  const dedupedMap = new Map();
  result.forEach((room) => {
    const myId = String(userId);
    const otherId = room.owner && String(room.owner._id || room.owner.id || room.owner) !== myId
      ? String(room.owner._id || room.owner.id || room.owner)
      : String(room.renter && (room.renter._id || room.renter.id || room.renter));
    const key = `${room.propertyId || 'prop'}:${otherId || 'unknown'}`;
    const lastTime = room.lastMessage?.time ? new Date(room.lastMessage.time).getTime() : 0;

    if (!dedupedMap.has(key)) {
      dedupedMap.set(key, { room, lastTime });
    } else {
      const prev = dedupedMap.get(key);
      if (lastTime > prev.lastTime) {
        dedupedMap.set(key, { room, lastTime });
      }
    }
  });

  const deduped = Array.from(dedupedMap.values())
    .map(v => v.room)
    .sort((a, b) => {
      const ta = a.lastMessage?.time ? new Date(a.lastMessage.time).getTime() : 0;
      const tb = b.lastMessage?.time ? new Date(b.lastMessage.time).getTime() : 0;
      return tb - ta;
    });

  res.json({ success: true, data: deduped });
});

// Mark messages as read
exports.markRead = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;
  const userId = req.user.id;

  const room = await ChatRoom.findById(roomId);
  if (!room) return next(new ErrorResponse('Room not found', 404));

  if (room.owner.toString() !== userId && room.renter.toString() !== userId) {
    return next(new ErrorResponse('Not authorized for this room', 403));
  }

  await ChatMessage.updateMany(
    { room: roomId, sender: { $ne: userId }, read: false },
    { $set: { read: true } }
  );

  res.json({ success: true });
});

// Post a message
exports.postMessage = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return next(new ErrorResponse('Message text required', 400));
  }

  const room = await ChatRoom.findById(roomId);
  if (!room) return next(new ErrorResponse('Room not found', 404));

  // Authorization: must be owner or renter
  if (room.owner.toString() !== req.user.id && room.renter.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized for this room', 403));
  }

  const message = await ChatMessage.create({
    room: roomId,
    sender: req.user.id,
    text: text.trim()
  });

  const io = req.app.get('io');
  if (io) {
    const payload = {
      _id: message._id,
      roomId,
      senderId: message.sender,
      text: message.text,
      time: message.createdAt
    };
    // Emit to room
    io.to(roomId).emit('chat_message', payload);
    // Notify owner and renter personal rooms
    const userRooms = [`user:${room.owner}`, `user:${room.renter}`];
    userRooms.forEach((r) => io.to(r).emit('chat_notify', payload));
  }

  res.status(201).json({
    success: true,
    data: {
      _id: message._id,
      roomId,
      senderId: message.sender,
      text: message.text,
      time: message.createdAt
    }
  });
});

