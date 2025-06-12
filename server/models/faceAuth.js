const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true, // Ensure email is always stored in lowercase
        trim: true      // Remove any whitespace
    },
    faceEmbedding: { type: [Number], required: true }, // Storing face data as an array of numbers
    webAuthnCredential: { type: Object } // Storing fingerprint credential
});

module.exports = mongoose.model("Face", faceSchema);
