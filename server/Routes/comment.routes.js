const express = require('express');
const router = express.Router();
const { addComment, getCommentsByGame,updateComment,deleteComment } = require('../controller/comment.controller')
const {verifyToken}  = require('../MiddleWare/authMiddleware')

router.post('/:gameId', verifyToken,addComment);        // POST a comment for a game
router.get('/:gameId',getCommentsByGame);  // GET all comments for a game
router.put('/:commentId',verifyToken,updateComment)
router.delete('/:commentId',verifyToken,deleteComment)


module.exports = router;
