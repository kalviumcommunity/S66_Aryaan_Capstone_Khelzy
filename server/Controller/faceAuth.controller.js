const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { createTokens } = require("../MiddleWare/authMiddleware");
const redis = require("redis");

// Configure Redis client for tracking failed attempts
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = redis.createClient({
  url: REDIS_URL
});

// Connect to Redis or use fallback to Map if Redis isn't available
let redisConnected = false;
(async () => {
  try {
    await redisClient.connect();
    redisConnected = true;
    console.log("Redis connected successfully for auth tracking");
  } catch (err) {
    console.warn("Redis connection failed, using in-memory fallback:", err.message);
  }
})();

// Fallback for when Redis is unavailable
const failedAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Track last log time to prevent log flooding
let lastLogTime = 0;

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

    const SIMILARITY_THRESHOLD = Math.min(Math.max(parseFloat(process.env.FACE_SIMILARITY_THRESHOLD) || 0.92, 0.7), 0.98);
    
    if (similarity < SIMILARITY_THRESHOLD) {
      const attemptKey = `failed_attempts:${normalizedEmail}`;
      let attempts = { count: 0, lastAttempt: 0 };
      
      // Get attempts data from Redis or fallback to in-memory Map
      if (redisConnected) {
        try {
          const attemptsData = await redisClient.get(attemptKey);
          if (attemptsData) {
            attempts = JSON.parse(attemptsData);
          }
        } catch (err) {
          console.error('Error retrieving attempt data from Redis:', err);
          // Fallback to in-memory storage
          attempts = failedAttempts.get(normalizedEmail) || { count: 0, lastAttempt: 0 };
        }
      } else {
        attempts = failedAttempts.get(normalizedEmail) || { count: 0, lastAttempt: 0 };
      }

      if (attempts.count >= MAX_ATTEMPTS && Date.now() - attempts.lastAttempt < LOCKOUT_TIME) {
        const timeRemaining = Math.ceil((LOCKOUT_TIME - (Date.now() - attempts.lastAttempt)) / 1000 / 60);
        return res.status(429).json({
          message: `Too many failed attempts. Please try again in ${timeRemaining} minutes.`,
          verified: false,
          retryAfter: timeRemaining
        });
      }
      
      // Rate limit logging to prevent log flooding
      if (Date.now() - lastLogTime > 60000) {
        console.warn(`Face verification failed for ${normalizedEmail}: similarity below threshold`);
        lastLogTime = Date.now();
      }

      // Reset attempts if lockout time has passed
      const newCount = (Date.now() - attempts.lastAttempt > LOCKOUT_TIME) ? 1 : attempts.count + 1;
      const newAttemptData = {
        count: newCount,
        lastAttempt: Date.now()
      };

      // Update failed attempts in Redis or fallback
      if (redisConnected) {
        try {
          // Set with expiration equal to lockout time
          await redisClient.setEx(attemptKey, Math.ceil(LOCKOUT_TIME/1000), JSON.stringify(newAttemptData));
        } catch (err) {
          console.error('Error storing attempt data in Redis:', err);
          // Fallback to in-memory
          failedAttempts.set(normalizedEmail, newAttemptData);
        }
      } else {
        failedAttempts.set(normalizedEmail, newAttemptData);
      }
      
      return res.status(401).json({
        message: "Face verification failed - Not enough similarity",
        verified: false,
        ...(process.env.NODE_ENV === 'development' && { similarity, threshold: SIMILARITY_THRESHOLD })
      });
    }
    
    // Reset failed attempts on successful login
    const attemptKey = `failed_attempts:${normalizedEmail}`;
    if (redisConnected) {
      try {
        await redisClient.del(attemptKey);
      } catch (err) {
        console.error('Error deleting attempt data from Redis:', err);
        // Don't fallback to in-memory deletion as it creates inconsistency
      }
    } else {
      failedAttempts.delete(normalizedEmail);
    }
    
    // Log successful authentication for security audit trail
    console.info(`[${new Date().toISOString()}] Successful face authentication for user: ${normalizedEmail} (ID: ${user._id})`);

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
      ...(process.env.NODE_ENV === 'development' && { similarity }),
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
    
    // Log successful face embedding update for security audit trail
    console.info(`[${new Date().toISOString()}] Face authentication updated for user: ${normalizedEmail} (ID: ${user._id})`);

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

// Handle graceful shutdown
const gracefulShutdown = async () => {
  if (redisConnected) {
    try {
      await redisClient.quit();
      console.log('Redis connection closed gracefully');
    } catch (err) {
      console.error('Error closing Redis connection:', err);
    }
  }
};

// Export only the necessary functions - remove all code after this
const SHUTDOWN_TIMEOUT = 5000;

process.on('SIGTERM', async () => {
  const shutdownTimeout = setTimeout(() => {
    console.error('Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
  
  try {
    await gracefulShutdown();
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
  } finally {
    clearTimeout(shutdownTimeout);
    process.exit(0);
  }
});

module.exports = {
  signup,
  login,
  checkEmailExists,
  updateFaceEmbedding,
  verifyAuth,
  gracefulShutdown
};

