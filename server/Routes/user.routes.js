const express = require('express');
const { register, login, logout,refreshAccessToken} = require('../Controller/user.controller');
const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/refresh-token', refreshAccessToken);

module.exports = {userRouter}

