const express = require('express');
const { addGame, getGames, getGameById, updateGame, deleteGame, getGameCount, updateGameCount, getAllGameCounts } = require('../Controller/game.controller');
const { verifyToken } = require('../MiddleWare/auth');

const gameRouter = express.Router();

// Public routes
gameRouter.get('/', getGames);
gameRouter.get('/counts', getAllGameCounts);  // New route for getting all game counts
gameRouter.get('/:id', getGameById);
gameRouter.get('/:id/count',verifyToken, getGameCount);

// Protected routes - require authentication
gameRouter.post('/add', verifyToken, addGame);
gameRouter.patch('/update/:id', verifyToken, updateGame);
gameRouter.patch('/:id/count',  updateGameCount);
gameRouter.delete('/delete/:id', verifyToken, deleteGame);

module.exports = { gameRouter };
