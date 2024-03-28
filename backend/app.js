const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");
const connectDB = require("./db")();

const intentControllers = require("./controllers/intentControllers");
const categoriesControllers = require("./controllers/categoriesControllers");
const audioControllers = require("./controllers/audioControllers");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

const port = config.BACKEND_PORT;

// Routes
// API
app.route("/api").get((req, res) => {
  try {
    res
      .status(200)
      .json({ message: "success", data: "API is up and running " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// INTENTS
app
  .route("/api/audios/categories/intents/:id")
  .get(intentControllers.getSingleIntent)
  .patch(intentControllers.updateSingleIntent)
  .delete(intentControllers.deleteSingleIntent);

app
  .route("/api/audios/categories/intents")
  .post(intentControllers.createIntent)
  .get(intentControllers.getAllIntents);

// CATEGORIES
app.route("/api/audios/categories").get(categoriesControllers.getAllCategories);

// AUDIOS
app
  .route("/api/audios")
  .get(audioControllers.getAllAudios)
  .post(audioControllers.createAudio);

app
  .route("/api/audios/:id")
  .get(audioControllers.getSingleAudio)
  .patch(audioControllers.updateSingleAudio)
  .delete(audioControllers.deleteSingleAudio);

app.get("/api/audios/random/waiting", audioControllers.getRandomWaitingAudio);

// 404 Route
app.route("*").get((req, res) => {
  res.status(404).json({ message: "Resource Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
