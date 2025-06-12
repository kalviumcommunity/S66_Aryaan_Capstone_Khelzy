const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructions: { 
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],  // Changed to array of strings
        required: true
    },
    width: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    developer: {
        type: String,
        required: true
    },
    liked: {
        type: Number,
        default: 0
    },
    disLiked:{
        type:Number,
        default:0
    }
}, {
    timestamps: true
});

const GameModel = mongoose.model('Game', gameSchema);

module.exports = { GameModel };
