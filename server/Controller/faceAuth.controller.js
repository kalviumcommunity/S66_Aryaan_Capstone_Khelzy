const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { createTokens } = require("../MiddleWare/authMiddleware");

// Utility: Cosine Similarity
function cosineSimilarity(vec1, vec2) {
  if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
    return 0;
  }
  
  if (!vec1.every(v => typeof v === 'number' && !isNaN(v) && isFinite(v)) || 
      !vec2.every(v => typeof v === 'number' && !isNaN(v) && isFinite(v))) {
    return 0;
  }
  
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

// Signup (with face embedding)
const signup = async (req, res) => {
  try {
    const { email, faceEmbedding } = req.body;

    if (!email || !faceEmbedding) {
      return res.status(400).json({
        message: "Email and face embedding are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!Array.isArray(faceEmbedding) || faceEmbedding.length !== 128) {
      return res.status(400).json({
        message: "Invalid face embedding format",
      });
    }

    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    // User doesn't exist
    if (!existingUser) {
      return res.status(404).json({
        message:
          "No account found with this email. Please sign up or log in with email/password or Google first.",
        exists: false,
      });
    }

    // User exists and already has face authentication
    if (existingUser.faceEmbedding) {
      return res.status(400).json({
        message: "Face authentication is already set up for this account!",
        exists: true,
        hasFaceAuth: true,
      });
    }

    // User exists but doesn't have face authentication yet
    existingUser.faceEmbedding = faceEmbedding;
    await existingUser.save();

    return res.status(200).json({
      message:
        "Face authentication has been successfully set up for your account!",
      isUpdate: true,
      exists: true,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Error during registration",
      error: err.message,
    });
  }
};

// Login (with face verification)
const login = async (req, res) => {
  try {
    const { email, faceEmbedding } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        message:
          "No account found with this email. Please sign up or log in with email/password or Google first.",
        verified: false,
        exists: false,
      });
    }

    if (!user.faceEmbedding) {
      return res.status(400).json({
        message:
          "Face authentication not set up for this account. Please set up face authentication first.",
        verified: false,
        needsSetup: true,
      });
    }

    const similarity = cosineSimilarity(faceEmbedding, user.faceEmbedding);

    if (isNaN(similarity)) {
      return res.status(400).json({
        message: "Invalid face embedding data - unable to calculate similarity",
        verified: false,
      });
    }

    const SIMILARITY_THRESHOLD = 0.92;

    if (similarity < SIMILARITY_THRESHOLD) {
      console.warn(`Face verification failed for ${normalizedEmail}: similarity=${similarity}, threshold=${SIMILARITY_THRESHOLD}`);
      return res.status(401).json({
        message: "Face verification failed - Not enough similarity",
        verified: false,
      });
    }

    // Generate tokens using user data
    const { accessToken, refreshToken } = createTokens({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
      maxAge: 3600000, // 1 hour
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("token", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.json({
      verified: true,
      similarity,
      message: "Login successful - Face verified",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Error during login",
      error: err.message,
      verified: false,
    });
  }
};

// Check if email exists
const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        exists: false,
        message:
          "No account found with this email. Please sign up or log in first.",
      });
    }

    return res.status(200).json({
      exists: true,
      hasFaceAuth: !!user.faceEmbedding,
      message: user.faceEmbedding
        ? "Face authentication is already set up for this account."
        : "Account found. You can set up face authentication.",
    });
  } catch (err) {
    console.error("Check email error:", err);
    res.status(500).json({
      message: "Error checking email",
      error: err.message,
    });
  }
};

// Update Face Embedding
const updateFaceEmbedding = async (req, res) => {
  try {
    const { email, faceEmbedding } = req.body;

    if (!email || !faceEmbedding) {
      return res.status(400).json({
        message: "Email and face embedding are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!Array.isArray(faceEmbedding) || faceEmbedding.length !== 128) {
      return res.status(400).json({
        message: "Invalid face embedding format",
      });
    }

    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        exists: false,
      });
    }

    // Check if the user already has face authentication set up
    if (!user.faceEmbedding) {
      return res.status(400).json({
        message:
          "No existing face authentication setup found. Please set up face authentication first.",
        exists: true,
        hasFaceAuth: false,
      });
    }

    // Update the face embedding
    user.faceEmbedding = faceEmbedding;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Face authentication has been successfully updated!",
    });
  } catch (err) {
    console.error("Update face embedding error:", err);
    res.status(500).json({
      message: "Error updating face embedding",
      error: err.message,
    });
  }
};

// Check authentication status
const verifyAuth = async (req, res) => {
  try {
    // If middleware has already verified the token, user is authenticated
    if (req.user) {
      return res.status(200).json({
        success: true,
        message: "Authentication valid",
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          profilePicture: req.user.profilePicture,
        },
      });
    }
    // No valid token or user found
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication verification",
    });
  }
};

module.exports = {
  signup,
  login,
  checkEmailExists,
  updateFaceEmbedding,
  verifyAuth
};
