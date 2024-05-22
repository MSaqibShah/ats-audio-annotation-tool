const { Audio: AudioModel } = require("../models/AudioExt");
const IntentModel = require("../models/Intent");
const ResponseModel = require("../models/Response");
const EmotionModel = require("../models/Emotion");

module.exports = {
  getSingleAudio: async (req, res) => {
    const id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }
    try {
      // mongoose query to get a audio by id
      const audio = await AudioModel.findById(req.params.id)
        .populate("nlp.intent")
        .populate("nlp.best_response")
        .populate("nlp.emotion");

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
  },
  getAllAudios: async (req, res) => {
    try {
      // mongoose query to get all audios
      const audios = await AudioModel.find()
        .populate("nlp.intent")
        .populate("nlp.best_response")
        .populate("nlp.emotion");

      res.status(200).json(audios);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  createAudio: async (req, res) => {
    try {
      // mongoose query to create a audio
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
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).json({ message: "Audio already exists" });
      }
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
  },
  updateSingleAudio: async (req, res) => {
    const id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }
    try {
      // Construct the update object with paths for nested fields
      audio = await AudioModel.findById(req.params.id);
      if (!audio) {
        return res
          .status(404)
          .json({ message: "audio not found", id: req.params.id });
      }
      for (const key in req.body) {
        if (key === "nlp") {
          for (const nlpKey in req.body[key]) {
            if (nlpKey === "intent") {
              const intent = await IntentModel.findById(req.body[key][nlpKey]);
              if (!intent) {
                return res
                  .status(404)
                  .json({ message: "Intent not found", id: id });
              }
              audio.nlp.intent = intent._id;
            }
            if (nlpKey === "best_response") {
              const response = await ResponseModel.findById(
                req.body[key][nlpKey]
              );
              if (!response) {
                return res
                  .status(404)
                  .json({ message: "Response not found", id: id });
              }
              audio.nlp.best_response = response._id;
            }
            if (nlpKey === "emotion") {
              const emotion = await EmotionModel.findById(
                req.body[key][nlpKey]
              );
              if (!emotion) {
                return res
                  .status(404)
                  .json({ message: "Emotion not found", id: id });
              }
              audio.nlp.emotion = emotion._id;
            }

            if (nlpKey === "better_response") {
              audio.nlp.better_response = req.body[key][nlpKey];
            }

            if (nlpKey === "gender") {
              audio.nlp.gender = req.body[key][nlpKey];
            }
            if (nlpKey === "entities") {
              audio.nlp.entities = req.body[key][nlpKey];
            }
          }
        } else {
          audio[key] = req.body[key];
        }
      }

      audio.save();
      await audio.populate("nlp.intent");
      await audio.populate("nlp.best_response");
      await audio.populate("nlp.emotion");

      res.status(200).json({ message: "success", audio: audio });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).json({ message: "Audio already exists" });
      }

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
  },
  deleteSingleAudio: async (req, res) => {
    const id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }
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
  },
  getRandomWaitingAudio: async (req, res) => {
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
      await audio.populate("nlp.intent");
      await audio.populate("nlp.best_response");
      await audio.populate("nlp.emotion");
      res.status(200).json({ message: "success", audio: audio });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
