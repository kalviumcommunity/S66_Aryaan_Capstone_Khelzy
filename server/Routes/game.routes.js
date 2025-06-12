const express = require("express");
const {
  addGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
  getGameCount,
  updateGameCount,
  getAllGameCounts,
  gameByCategory
} = require("../controller/game.controller");
const { verifyToken } = require("../MiddleWare/authMiddleware");

const gameRouter = express.Router();

// Public routes
gameRouter.get("/", getGames);
gameRouter.get("/counts", getAllGameCounts); // New route for getting all game counts
gameRouter.get("/:id", getGameById);
gameRouter.get("/:id/count", getGameCount);
gameRouter.get('/filter/:category', gameByCategory);
// Protected routes - require authentication
gameRouter.post("/add", verifyToken, addGame);
gameRouter.patch("/update/:id", verifyToken, updateGame);
gameRouter.put("/:id/count", updateGameCount);
gameRouter.delete("/delete/:id", verifyToken, deleteGame);

module.exports = { gameRouter };
