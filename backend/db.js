const mongoose = require("mongoose");
const config = require("./config"); // Adjust the path as necessary to import your config
// Function to connect to MongoDB
const connectDB = async () => {
  const config_db = {
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (config.NODE_ENV === "prod") {
    config_db.user = process.env.MONGO_DB_USER_PROD;
    config_db.pass = process.env.MONGO_DB_PASS_PROD;
  }

  try {
    await mongoose.connect(config.MONGO_DB_URI, config_db);
    // await mongoose.connect("mongodb://127.0.0.1:27017/ats_tool", config_db);
    console.log("Connected to MongoDB At:", config.MONGO_DB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
