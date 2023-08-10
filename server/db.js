const mongoose = require('mongoose').default;
require('dotenv').config();

const uri = process.env.CON_URI;

const connectDB = async () => {
    try {
        const con = await mongoose.connect(uri);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;