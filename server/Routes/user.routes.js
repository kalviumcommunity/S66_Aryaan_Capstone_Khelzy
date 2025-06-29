const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { register, login, logout, getCurrentUser, checkAuth, refreshAccessToken } = require('../Controller/user.controller');
const { verifyToken, createTokens } = require('../MiddleWare/authMiddleware');
const { UserModel } = require('../models/user.model');


const userRouter = express.Router();
const authRouter = express.Router();

// Public routes (no authentication required)
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/refresh-token', refreshAccessToken);

// Protected routes (authentication required)
userRouter.get('/me', verifyToken, getCurrentUser);
userRouter.get('/check', verifyToken, checkAuth);

// Google Authentication routes
authRouter.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account consent', // Add this to always show prompt
    accessType: 'offline'
  })
);

authRouter.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      session: false
      // Note: Use server-level timeout configuration instead
    })(req, res, (err) => {
      if (err) {
        console.error('Google Auth Error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent('Authentication failed')}`);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User data not found');
      }
      
      const user = req.user;
      const { accessToken, refreshToken } = createTokens(user);
      
      // Cookie options for access token
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || process.env.HTTPS === 'true',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      };

      // Cookie options for refresh token
      const refreshCookieOptions = {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      };

      res.cookie('token', accessToken, cookieOptions);
      res.cookie('refreshToken', refreshToken, refreshCookieOptions);
      
      // User data is already included in the access token
      // No need for additional userToken cookie

      res.redirect(`${process.env.FRONTEND_URL}/oauth-callback`);
    } catch (error) {
      console.error('Auth Callback Error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent('Authentication failed')}`);
    }
  }
);

// Add error recovery route
authRouter.get('/auth-error', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent('Please try again')}`);
});

module.exports = { userRouter, authRouter };
