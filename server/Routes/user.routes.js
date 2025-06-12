const express = require('express');
const passport = require('passport');
const { register, login, logout, getCurrentUser, checkAuth, refreshAccessToken } = require('../controller/user.controller');
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
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: 'http://localhost:8080'
    }),
    async (req, res) => {
        const user = await UserModel.findById(req.user._id).populate('friends');
        const { accessToken, refreshToken } = createTokens(user);

        const cookieOptions = {
            httpOnly: true,
            secure: true, // Always use secure in modern browsers
            sameSite: 'none', // Required for cross-origin
            maxAge: 3600000, // 1 hour
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
        };

        const refreshCookieOptions = {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        res.cookie('token', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        const frontendURL = 'http://localhost:5173';
            
        res.redirect(`${frontendURL}/auth/callback?token=${accessToken}`);
    }
);

module.exports = { userRouter, authRouter };
