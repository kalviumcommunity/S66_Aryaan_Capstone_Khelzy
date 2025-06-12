const mongoose = require('mongoose')

const commentModel = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    gameId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Game",
        required:true
    },
    text:{
        type:String,
        required:true
    },

},{timestamps:true});

module.exports = mongoose.model("Comment",commentModel)