const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");
const connectDB = require("./db")();
const path = require("path");

console.log("SERVER IS RUNNING ON: ", config.NODE_ENV);

const intentControllers = require("./controllers/intentControllers");
const categoriesControllers = require("./controllers/categoriesControllers");
const audioControllers = require("./controllers/audioControllers");
const responseControllers = require("./controllers/responseControllers");
const emotionControllers = require("./controllers/emotionControllers");
const callControllers = require("./controllers/callControllers");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

const port = config.BACKEND_PORT;

// Routes
// Serve static assets if in production
if (config.NODE_ENV == "prod") {
  const path_to_index = path.join(__dirname, "frontend/build", "index.html");
  console.log(path_to_index);

  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("/", function (req, res) {
    res.sendFile(path_to_index);
  });
}
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
  .route("/api/audios/categories/intents/name/:intent_name")
  .get(intentControllers.getSingleIntentByName);

app
  .route("/api/audios/categories/intents")
  .post(intentControllers.createIntent)
  .get(intentControllers.getAllIntents);

// RESPONSES
app
  .route("/api/audios/categories/responses/:id")
  .get(responseControllers.getSingleResponse)
  .patch(responseControllers.updateSingleResponse)
  .delete(responseControllers.deleteSingleResponse);
app
  .route("/api/audios/categories/responses")
  .post(responseControllers.createResponse)
  .get(responseControllers.getAllResponses);

// EMOTIONS
app
  .route("/api/audios/categories/emotions/:id")
  .get(emotionControllers.getSingleEmotion)
  .patch(emotionControllers.updateSingleEmotion)
  .delete(emotionControllers.deleteSingleEmotion);
app
  .route("/api/audios/categories/emotions")
  .post(emotionControllers.createEmotion)
  .get(emotionControllers.getAllEmotions);
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
app.get("/api/audios/index/:index", audioControllers.getSingleByIndex);

// Call
app
  .route("/api/calls")
  .get(callControllers.getAllCalls)
  .post(callControllers.createCall);

app
  .route("/api/calls/:call_id")
  .get(callControllers.getSingleCall)
  .patch(callControllers.updateSingleCall)
  .delete(callControllers.deleteSingleCall);

app.route("/api/calls/index/:index").get(callControllers.getSingleCallByIndex);
// 404 Route
app.route("*").get((req, res) => {
  res.status(404).json({ message: "Resource Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
