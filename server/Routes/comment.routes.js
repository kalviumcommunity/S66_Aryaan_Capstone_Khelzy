const express = require('express');
const commentRouter = express.Router();
const { addComment, getCommentsByGame,deleteAll } = require('../Controller/comment.controller')
const {verifyToken}  = require('../MiddleWare/auth')

commentRouter.post('/:gameId', verifyToken,addComment);        // POST a comment for a game
commentRouter.get('/:gameId',getCommentsByGame);  // GET all comments for a game
commentRouter.delete('/',deleteAll)

module.exports = {commentRouter};
