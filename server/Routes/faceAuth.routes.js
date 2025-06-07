const express = require('express');
const router = express.Router();
const { signup, login, verifyFace, verifyAuth } = require('../controller/faceAuth.controller');

router.post('/face/signup', signup);
router.post('/face/login', login);
router.post('/face/verify', verifyFace);
router.get('/verify-auth', verifyAuth);

module.exports = router;
