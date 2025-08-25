const mongoose = require('mongoose');

const connectDB = async () => {
    const dbURI = `mongodb://mongodb:27017/LoginTeste`;

    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
};

module.exports = connectDB;