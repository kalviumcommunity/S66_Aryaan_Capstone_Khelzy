const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async(req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB is connected")
    }catch(error){
        console.error("MongoDB failed to connect",error.message)
    }
}

module.exports = connectDB