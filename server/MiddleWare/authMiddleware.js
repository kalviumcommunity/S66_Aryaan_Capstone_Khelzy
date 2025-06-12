const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');

const createTokens = (user) => {
    const tokenPayload = {
        userId: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        friends: user.friends
    };

    const accessToken = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '8h' }
    );
    
    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
        { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
};

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        // Get token from request headers or cookies
        let token = req.cookies?.token;
        
        // If token is not in cookies, check Authorization header
        if (!token) {
            const authHeader = req.headers.authorization;
            token = authHeader && authHeader.split(' ')[1];
        }
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. Login to continue.' 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        
        // Find user and attach to request
        const user = await UserModel.findById(decoded.userId).populate('friends');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Attach decoded token and user to request object
        req.user = user;
        req.tokenData = decoded;
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired',
                expired: true
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

module.exports = { verifyToken, createTokens };