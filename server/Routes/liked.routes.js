const express = require('express')
const router = express.Router()
const {likeGame,unlikeGame,checkTheLike,likedGames} = require('../Controller/liked.controller')
const { verifyToken } = require('../MiddleWare/authMiddleware')  // Add your auth middleware

router.post('/like/:gameId', verifyToken, likeGame)
router.delete('/unlike/:gameId', verifyToken, unlikeGame)
router.get('/check/:gameId', verifyToken, checkTheLike)
router.get('/liked',verifyToken,likedGames)

module.exports = router