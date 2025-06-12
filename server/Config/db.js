const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB connection URL not found in environment variables');
        }
        
        const connection = await mongoose.connect(process.env.MONGO_URL);
        
        console.log('✅ MongoDB Connected Successfully');
        return connection;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

module.exports = { connectDB };
