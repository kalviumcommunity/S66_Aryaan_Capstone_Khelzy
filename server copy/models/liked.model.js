const mongoose = require('mongoose')

const likedSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    gameId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Game',
        required:true
    },
    status:{
        type:Boolean,
        default:false
    }

})

likedSchema.index({ userId: 1, gameId: 1 }, { unique: true });

const LikeModel = mongoose.model('Liked',likedSchema)

module.exports = { LikeModel }