const mongoose = require('mongoose');

const connectDB = async () => {     
    try {
        await mongoose.connect("mongodb+srv://heetdhameliya59:6x5Dqg9JdZN3WLle@cluster0.oauedhu.mongodb.net/");
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = connectDB;