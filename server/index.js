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

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Keep for potential OAuth flows

// Enable CORS with specific origins and configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'https://khelzy.vercel.app',
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Session middleware (keep minimal for OAuth flows)
app.use(session({
  secret: process.env.SESSION_SECRET || 'someDefaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
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
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();
