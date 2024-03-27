const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");
const {
  Audio: AudioModel,
  AUDIO_EMOTIONS,
  AUDIO_GENDERS,
  AUDIO_STATUSES,
  AUDIO_INTENTS,
  AUDIO_RESPONSES,
} = require("./models/AudioExt");

const app = express();
const port = config.BACKEND_PORT;

// app.use((req, res, next) => {
//   let data = "";
//   req.on("data", (chunk) => {
//     data += chunk;
//   });
//   req.on("end", () => {
//     console.log("Raw request body:", data);
//     next();
//   });
// });

app.use(express.json({ limit: "50mb" }));
app.use(cors());
// Connect to MongoDB using Mongoose
mongoose
  .connect(config.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB At: ", config.MONGO_DB_URI);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define routes and middleware here

app.route("/api/audios/categories").get((req, res) => {
  let category_data = {
    emotions: AUDIO_EMOTIONS,
    genders: AUDIO_GENDERS,
    status: AUDIO_STATUSES,
    intents: AUDIO_INTENTS,
    responses: AUDIO_RESPONSES,
  };
  res.status(200).json({ message: "success", data: category_data });
});

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

app
  .route("/api/audios")
  .get(async (req, res) => {
    try {
      // mongoose query to get all audios
      const audios = await AudioModel.find();
      res.status(200).json(audios);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  })
  .post(async (req, res) => {
    try {
      // mongoose query to create a audio
      console.log(req.body);
      audioData = req.body;
      if (!audioData) {
        return res.status(400).json({ message: "Data is required" });
      }

      if (!audioData.audio) {
        return res.status(400).json({ message: "Audio Data is required" });
      }
      if (!audioData.text) {
        return res
          .status(400)
          .json({ message: "Text Transcription is required" });
      }

      const audio = await AudioModel.create(audioData);
      res.status(201).json({ message: "success", audio: audio });
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => {
          if (val.kind === "enum") {
            return {
              message: val.message,
              accepted_values: val.properties.enumValues,
            };
          }
          return val.message;
        });
        return res.status(400).json({ message: messages });
      }
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  });

app
  .route("/api/audios/:id")
  .get(async (req, res) => {
    try {
      // mongoose query to get a audio by id
      const audio = await AudioModel.findById(req.params.id);

      if (!audio) {
        return res
          .status(404)
          .json({ message: "audio not found", id: req.params.id });
      }
      res.status(200).json({ message: "success", audio: audio });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  })
  .patch(async (req, res) => {
    try {
      // mongoose query to update a audio by id
      const audio = await AudioModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!audio) {
        return res
          .status(404)
          .json({ message: "audio not found", id: req.params.id });
      }
      res.status(200).json(audio);
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => {
          if (val.kind === "enum") {
            return {
              message: val.message,
              accepted_values: val.properties.enumValues,
            };
          }
          return val.message;
        });
        return res.status(400).json({ message: messages });
      }
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  })
  .delete(async (req, res) => {
    try {
      // mongoose query to delete a audio by id
      const audio = await AudioModel.findByIdAndDelete(req.params.id);

      if (!audio) {
        return res
          .status(404)
          .json({ message: "audio not found", id: req.params.id });
      }
      res.status(200).json({ message: "audio deleted", audio: audio });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  });

app.get("/api/audios/random/waiting", async (req, res) => {
  try {
    const audio = await AudioModel.findOne({ status: "waiting" });
    if (!audio) {
      return res
        .status(200)
        .json({ message: "No new audio found", audio: null });
    }

    // update the status of the audio to processing
    audio.status = "processing";
    await audio.save();
    res.status(200).json({ message: "success", audio: audio });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.route("*").get((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
