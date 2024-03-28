const mongoose = require("mongoose");
const config = require("./config"); // Adjust the path as necessary to import your config

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB At:", config.MONGO_DB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
