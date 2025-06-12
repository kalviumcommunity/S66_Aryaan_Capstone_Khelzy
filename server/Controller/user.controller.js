const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');
const { createTokens } = require('../MiddleWare/authMiddleware');



const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 12);
        const user = new UserModel({ 
            name, 
            email, 
            password: hash,
           
        });
        await user.save();
        
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            user : user
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await UserModel.findOne({ email }).populate('friends');
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = createTokens(user);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
            maxAge: 28800000 // 8 hours
        };

        const refreshCookieOptions = {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        // Set tokens in cookies
        res.cookie('token', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        res.status(200).json({ 
            success: true,
            token: accessToken, // Send token in response for localStorage
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                friends: user.friends
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
};

const logout = async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
        };

        // Clear auth cookies with matching options
        res.clearCookie('token', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        // Clear any other session-related cookies
        Object.keys(req.cookies).forEach(cookieName => {
            res.clearCookie(cookieName, cookieOptions);
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Get the current authenticated user
 * This function is used to verify if a user is logged in and to get their data
 */
const getCurrentUser = async (req, res) => {
    try {
        // Get userId from token with null check
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        // Fetch the complete user data from database
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Check if the user is authenticated without returning user data
 * Useful for simple auth checks on protected routes
 */
const checkAuth = async (req, res) => {
    // If this function is reached, the user is authenticated (verifyToken middleware)
    res.status(200).json({
        success: true,
        isAuthenticated: true
    });
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token not found'
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = createTokens(user);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
            maxAge: 3600000 // 1 hour
        };

        const refreshCookieOptions = {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        // Set new tokens in cookies
        res.cookie('token', newAccessToken, cookieOptions);
        res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

        res.json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = { register, login, logout, getCurrentUser, checkAuth, refreshAccessToken };
