const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');

const createTokens = (user) => {
    // Make sure to handle both user._id and user.id formats
    const userId = user._id || user.id;
    
    const tokenPayload = {
        userId: userId,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
    };

    const accessToken = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
    );
    
    const refreshToken = jwt.sign(
        { userId: userId },
        process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
        { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
};

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        // Get token from Authorization header first, then fallback to cookies
        let token = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
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
        const user = await UserModel.findById(decoded.userId);
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