const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, 
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Ensure email is always stored in lowercase
    trim: true      // Remove any whitespace
  },
  password: {
    type: String,
    required: false, // Changed to false since Google auth users won't have a password
  },
  googleId: {
    type: String,
    sparse: true, // Allows null/undefined but ensures uniqueness for non-null values
  },
  profilePicture: {
    type: String,
  },
  // Face authentication fields merged from faceAuth.js
  faceEmbedding: { 
    type: [Number],
    default: null
  },
  webAuthnCredential: { 
    type: Object,
    default: null 
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
