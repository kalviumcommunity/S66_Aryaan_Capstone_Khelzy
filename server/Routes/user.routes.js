const express = require('express');
const passport = require('passport');
const { register, login, logout, getCurrentUser, checkAuth, refreshAccessToken } = require('../Controller/user.controller');
const { verifyToken, createTokens } = require('../MiddleWare/authMiddleware');
const { UserModel } = require('../models/user.model');
require('dotenv').config()


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
        failureRedirect: process.env.SERVER_URL
    }),
    async (req, res) => {
        const user = await UserModel.findById(req.user._id)
        const { accessToken, refreshToken } = createTokens(user);

        const isProduction = process.env.NODE_ENV === 'production';
        
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 3600000, // 1 hour
            path: '/'
        };

        const refreshCookieOptions = {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        res.cookie('token', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        const frontendURL = process.env.FRONTEND_URL || `http://localhost:5173`;
            
        // Passing token in URL for the initial verification only
        // The actual auth will use the HttpOnly cookies set above
        res.redirect(`${frontendURL}/auth/callback?token=${accessToken}`);
    }
);

module.exports = { userRouter, authRouter };
