const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middlewares/error');
const { Server } = require('socket.io');
const ChatMessage = require('./models/chatMessage');
const ChatRoom = require('./models/chatRoom');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kirayedar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Allowed origins (env or defaults)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map(o => o.trim());

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors({
  origin: allowedOrigins,
  credentials: true // Allow cookies to be sent with requests
})); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Parse JSON request body (increased for large uploads)
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded request body (increased for large uploads)
app.use(cookieParser()); // Parse cookies
app.use(morgan('dev')); // HTTP request logger

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // higher ceiling to avoid auth flapping during active sessions
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skip: (req) => {
    // Do not rate-limit auth token refresh/profile checks
    const path = req.path || '';
    return path.includes('/users/refresh-token') || path.includes('/users/me');
  }
});
app.use('/api/', limiter); // Apply rate limiting to API (with skips above)

// Import routes
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);

// 404 for unknown API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Centralized error handler
app.use(errorHandler);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// make io available in requests
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join_user', ({ userId }) => {
    if (userId) {
      socket.join(`user:${userId}`);
    }
  });

  socket.on('join_room', ({ roomId, userId, name, role }) => {
    if (!roomId) return;
    socket.join(roomId);
    socket.data = { roomId, userId, name, role };
    io.to(roomId).emit('presence', { userId, name, role, online: true, at: Date.now() });
  });

  socket.on('typing', ({ roomId, userId, name }) => {
    if (!roomId) return;
    socket.to(roomId).emit('typing', { userId, name, at: Date.now() });
  });

  socket.on('read_messages', ({ roomId, userId }) => {
    if (!roomId || !userId) return;
    io.to(roomId).emit('read_receipt', { roomId, userId, at: Date.now() });
  });

  socket.on('disconnect', () => {
    const { roomId, userId, name, role } = socket.data || {};
    if (roomId && userId) {
      io.to(roomId).emit('presence', { userId, name, role, online: false, at: Date.now() });
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));