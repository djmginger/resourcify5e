const mongoose = require('mongoose').default;
const uri = 'mongodb+srv://resourcify:jobYSkctbZnPV1KN@resourcify-test.1asfhex.mongodb.net/data?retryWrites=true&w=majority';

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