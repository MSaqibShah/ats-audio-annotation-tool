const { Audio: AudioModel } = require("../models/AudioExt");

module.exports = {
  getSingleAudio: async (req, res) => {
    const id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }
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
  },
  getAllAudios: async (req, res) => {
    try {
      // mongoose query to get all audios
      const audios = await AudioModel.find();
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
      res.status(200).json({ message: "success", audio: audio });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
