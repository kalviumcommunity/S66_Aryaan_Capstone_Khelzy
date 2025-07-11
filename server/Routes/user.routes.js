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
        failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173'
    }),
    async (req, res) => {
        const user = await UserModel.findById(req.user._id)
        const { accessToken, refreshToken } = createTokens(user);

        const frontendURL = process.env.FRONTEND_URL || `http://localhost:5173`;
            
        // Pass tokens through URL for localStorage storage
        res.redirect(`${frontendURL}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture
        }))}`);
    }
);

module.exports = { userRouter, authRouter };
