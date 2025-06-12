const express = require('express');
const router = express.Router();
const { addComment, getCommentsByGame } = require('../Controller/comment.controller')
const {verifyToken}  = require('../MiddleWare/authMiddleware')

router.post('/:gameId', verifyToken,addComment);        // POST a comment for a game
router.get('/:gameId',getCommentsByGame);  // GET all comments for a game


module.exports = router;
