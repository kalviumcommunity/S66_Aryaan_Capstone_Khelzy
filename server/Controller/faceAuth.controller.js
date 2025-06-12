const Face = require("../models/faceAuth");
const jwt = require("jsonwebtoken");
const { createTokens } = require("../MiddleWare/authMiddleware");

// Utility: Cosine Similarity
function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
    return dotProduct / (magnitude1 * magnitude2);
}

// Signup (with face embedding)
const signup = async (req, res) => {
    try {
        const { email, faceEmbedding } = req.body;
        
        if (!email || !faceEmbedding) {
            return res.status(400).json({ 
                message: "Email and face embedding are required" 
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!Array.isArray(faceEmbedding) || faceEmbedding.length !== 128) {
            return res.status(400).json({ 
                message: "Invalid face embedding format" 
            });
        }

        const existingUser = await Face.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const newUser = new Face({ email: normalizedEmail, faceEmbedding });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ 
            message: "Error during registration", 
            error: err.message 
        });
    }
};

// Login (with face verification)
const login = async (req, res) => {
    try {
        const { email, faceEmbedding } = req.body;
        
        const normalizedEmail = email.toLowerCase().trim();
        
        const faceUser = await Face.findOne({ email: normalizedEmail });

        if (!faceUser) {
            return res.status(404).json({ 
                message: "Face authentication not registered",
                verified: false 
            });
        }

        const similarity = cosineSimilarity(faceEmbedding, faceUser.faceEmbedding);
        const SIMILARITY_THRESHOLD = 0.92;

        if (similarity < SIMILARITY_THRESHOLD) {
            return res.status(401).json({
                message: "Face verification failed - Not enough similarity",
                similarity,
                verified: false,
                threshold: SIMILARITY_THRESHOLD
            });
        }

        // Generate tokens using faceUser instead of userData
        const { accessToken, refreshToken } = createTokens({ 
            id: faceUser._id,
            email: faceUser.email 
        });

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

        res.cookie('token', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        res.json({
            verified: true,
            similarity,
            message: "Login successful - Face verified",
            user: {
                id: faceUser._id,
                email: faceUser.email
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            message: "Error during login", 
            error: err.message, 
            verified: false 
        });
    }
};

// Face Verification (used independently)
const verifyFace = async (req, res) => {
    try {
        const { email, faceEmbedding } = req.body;

        if (!email || !faceEmbedding) {
            return res.status(400).json({ message: "Email and face embedding are required" });
        }

        const user = await Face.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const similarity = cosineSimilarity(faceEmbedding, user.faceEmbedding);
        const threshold = 0.8;
        const isMatch = similarity >= threshold;

        return res.json({
            isMatch,
            similarity,
            message: isMatch ? "Face verified successfully" : "Face verification failed"
        });
    } catch (error) {
        console.error("Face verification error:", error);
        return res.status(500).json({ 
            message: "Error verifying face", 
            error: error.message 
        });
    }
};

// Verify Authentication
const verifyAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No token found" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Face.findOne({ email: decoded.email }); // Changed from findById to findOne by email

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        return res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid token" 
        });
    }
};

module.exports = { signup, login, verifyFace, verifyAuth };
