const express = require('express');
const router = express.Router();
const { signup, login, checkEmailExists, updateFaceEmbedding, verifyAuth } = require('../Controller/faceAuth.controller');
const { verifyToken } = require('../MiddleWare/authMiddleware');

// Face auth registration and login
router.post('/face/signup', signup);
router.post('/face/login', login);

// Check if email exists for face auth
router.post('/check-email', checkEmailExists);

// Update existing face embedding
router.post('/face/update', updateFaceEmbedding);

// Verify authentication status
router.get('/verify-auth', verifyToken, verifyAuth);

module.exports = router;
