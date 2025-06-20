const { LikeModel } = require('../models/liked.model.js')
const { GameModel } = require('../models/game.model.js')  // Fix the import to use the correct model name

const likeGame = async(req,res) => {
    const userId = req.user.id  // Changed from req.body
    const {gameId} = req.params
    try {
        const existing = await LikeModel.findOne({userId, gameId})
        
        if (existing) {
            // Update existing record
            existing.status = true;
            await existing.save();
            return res.status(200).json({ liked: true, message: 'Game liked' });
        }        // Create new record
        await LikeModel.create({ userId, gameId, status: true });
        res.status(201).json({ liked: true, message: 'Game liked' });
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

const unlikeGame = async(req,res) => {
    const userId = req.user.id
    const {gameId} = req.params
    try {
        const result = await LikeModel.deleteOne({userId, gameId})
        if (result.deletedCount === 0) {
            return res.status(404).json({liked: false, message: 'Like not found'})
        }
        res.status(200).json({liked: false, message: 'Game unliked'})
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

const checkTheLike = async(req,res) => {
    const userId = req.user.id  // Changed from req.body
    const {gameId} = req.params
    try {
        const record = await LikeModel.findOne({userId, gameId})
        res.status(200).json({ 
            liked: !!record,
            status: record?.status || false
        });
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

const likedGames = async(req,res)=>{
    const userId = req.user?.id  // Add optional chaining
    
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' })
    }

    try{
        const likedGames = await LikeModel.find({userId})

        if (!likedGames.length) {
            return res.status(200).json({ games: [] })
        }

        const gameIds = likedGames.map(record => record.gameId)

        const games = await GameModel.find({  // Use GameModel instead of Game
            _id: { $in: gameIds }
        })

        if (!games.length) {
            return res.status(200).json({ games: [] })
        }

        return res.status(200).json({ games })
    } catch(error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {likeGame,unlikeGame,checkTheLike,likedGames}