const { GameModel } = require("../models/game.model");

const addGame = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "url",
      "developer",
      "rating",
      "tags",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`,
        });
      }
    }

    // Check if game with same title already exists
    const existingGameTitle = await GameModel.findOne({
      title: req.body.title,
    });
    if (existingGameTitle) {
      return res.status(400).json({
        success: false,
        error: "A game with this title already exists",
      });
    }

    const game = new GameModel(req.body);
    await game.save();
    res.status(201).json({
      success: true,
      message: "Game added successfully",
      game,
    });
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error adding game",
    });
  }
};

const getGames = async (req, res) => {
  try {
    const games = await GameModel.find();
    res.status(200).json({
      success: true,
      games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching games",
    });
  }
};

const getGameById = async (req, res) => {
  try {
    const game = await GameModel.findById(req.params.id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }
    res.status(200).json({
      success: true,
      game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching game",
    });
  }
};

const gameByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required",
      });
    }

    const games = await GameModel.find({
      $or: [
        { category: { $regex: category, $options: 'i' } },
        { tags: { $in: [new RegExp(category, 'i')] } }
      ]
    });

    if (!games || games.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No games found in this category or with matching tags",
      });
    }

    res.status(200).json({
      success: true,
      games,
      count: games.length
    });

  } catch (error) {
    console.error("Error in gameByCategory:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching games by category or tags",
    });
  }
};

const updateGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Game updated successfully",
      game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating game",
    });
  }
};

const deleteGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting game",
    });
  }
};

const getGameCount = async (req, res) => {
  try {
    const game = await GameModel.findById(req.params.id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }
    res.status(200).json({
      success: true,
      count: game.count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching game count",
    });
  }
};

const updateGameCount = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndUpdate(
      req.params.id,
      { $inc: { count: 1 } },
      { new: true }
    );
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Game count updated successfully",
      count: game.count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating game count",
    });
  }
};

const getAllGameCounts = async (req, res) => {
  try {
    const games = await GameModel.find({}, "_id title count updatedAt");
    res.status(200).json({
      success: true,
      games: games.map((game) => ({
        _id: game._id,
        title: game.title,
        count: game.count,
        updatedAt: game.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching game counts",
    });
  }
};

module.exports = {
  addGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
  getGameCount,
  updateGameCount,
  getAllGameCounts,
  gameByCategory
};
