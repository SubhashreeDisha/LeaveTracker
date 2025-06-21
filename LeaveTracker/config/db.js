const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Leave-Tracker");
        console.log("Connected to mongoDB Database");
    } catch (error) {
        console.log("Error While Connecting to database");
    }
}

module.exports = connectToDatabase;