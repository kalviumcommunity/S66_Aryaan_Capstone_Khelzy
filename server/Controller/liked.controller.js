const Liked = require('../models/liked.model.js')

const likeGame = async(req,res) => {
    const userId = req.user.id  // Changed from req.body
    const {gameId} = req.params
    try {
        const existing = await Liked.findOne({userId, gameId})
        
        if (existing) {
            // Update existing record
            existing.status = true;
            await existing.save();
            return res.status(200).json({ liked: true, message: 'Game liked' });
        }

        // Create new record
        await Liked.create({ userId, gameId, status: true });
        res.status(201).json({ liked: true, message: 'Game liked' });
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

const unlikeGame = async(req,res) => {
    const userId = req.user.id
    const {gameId} = req.params
    try {
        const result = await Liked.deleteOne({userId, gameId})
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
        const record = await Liked.findOne({userId, gameId})
        res.status(200).json({ 
            liked: !!record,
            status: record?.status || false
        });
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

const likedGames = async(req,res)=>{
    const userId = req.user.id
    const gameId = req.params
    try{
        const record = await Liked.find({userId,gameId})
        res.status(200).json({record})
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

module.exports = {likeGame,unlikeGame,checkTheLike,likedGames}