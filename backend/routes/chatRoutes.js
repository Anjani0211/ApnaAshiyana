const express = require('express');
const router = express.Router({ mergeParams: true });
const { ensureRoom, getMessages, postMessage, listRooms, markRead } = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');

router.use(protect);

// Ensure room for property + renter
router.post('/room/:propertyId', ensureRoom);

// Messages
router.get('/:roomId/messages', getMessages);
router.post('/:roomId/messages', postMessage);
router.post('/:roomId/read', markRead);

// Rooms list
router.get('/rooms/list', listRooms);

module.exports = router;

