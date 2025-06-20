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
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
