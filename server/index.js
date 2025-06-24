require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./Config/passport');
const { connectDB } = require('./Config/db');
const { userRouter, authRouter } = require('./Routes/user.routes');
const { gameRouter } = require('./Routes/game.routes');
const commentRouter = require('./Routes/comment.routes');
const likeRouter = require('./Routes/liked.routes');
const faceAuthRouter = require('./Routes/faceAuth.routes');
const { gracefulShutdown } = require('./Controller/faceAuth.controller');

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Enable CORS with specific origins and configuration
// Update the CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization'],
}));

app.enable('trust proxy'); // Add this line for secure cookies to work

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'someDefaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/games', gameRouter);
app.use('/comments', commentRouter);
app.use('/favo', likeRouter);
app.use('/faceAuth', faceAuthRouter);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    // Setup graceful shutdown with timeout
    const SHUTDOWN_TIMEOUT = 5000;

    // Setup shutdown hooks
    process.on('SIGINT', async () => {
      const shutdownTimeout = setTimeout(() => {
        console.error('Graceful shutdown timeout, forcing exit');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT);
      
      try {
        // Close server first to stop accepting new connections
        server.close(() => console.log('Server closed'));
        // Then run other cleanup tasks
        await gracefulShutdown();
      } catch (err) {
        console.error('Error during graceful shutdown:', err);
      } finally {
        clearTimeout(shutdownTimeout);
        process.exit(0);
      }
    });

    process.on('SIGTERM', async () => {
      const shutdownTimeout = setTimeout(() => {
        console.error('Graceful shutdown timeout, forcing exit');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT);
      
      try {
        // Close server first to stop accepting new connections
        server.close(() => console.log('Server closed'));
        // Then run other cleanup tasks
        await gracefulShutdown();
      } catch (err) {
        console.error('Error during graceful shutdown:', err);
      } finally {
        clearTimeout(shutdownTimeout);
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();
