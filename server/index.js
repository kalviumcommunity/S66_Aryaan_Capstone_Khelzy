require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const MongoStore  = require('connect-mongo');
const { connectDB } = require('./config/db');
const { userRouter, authRouter } = require('./routes/user.routes');
const { gameRouter } = require('./routes/game.routes');
const commentRouter = require('./routes/comment.routes')
const faceAuthRoutes = require('./routes/faceAuth.routes');
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Enable CORS with specific origins and configuration
// Update the CORS configuration
app.use(cors({
  origin: ' http://localhost:5173',
  credentials: true,
  preflightContinue: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions'
  })
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/games', gameRouter);
app.use('/comments',commentRouter)
app.use('/faceAuth', faceAuthRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('✅ Server running on port 8080');
    });
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();