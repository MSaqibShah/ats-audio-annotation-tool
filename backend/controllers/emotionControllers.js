const EmotionModel = require("../models/Emotion");

const emotionControllers = {
  getSingleEmotion: async (req, res) => {
    id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }

    try {
      const emotion = await EmotionModel.findById(req.params.id);
      if (!emotion) {
        return res
          .status(404)
          .json({ message: "emotion not found", id: req.params.id });
      }
      res.status(200).json({ message: "success", emotion: emotion });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getAllEmotions: async (req, res) => {
    try {
      const emotions = await EmotionModel.find();
      res.status(200).json({ message: "success", emotions: emotions });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  updateSingleEmotion: async (req, res) => {
    id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }

    try {
      const emotion = await EmotionModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!emotion) {
        return res
          .status(404)
          .json({ message: "emotion not found", id: req.params.id });
      }
      res.status(200).json(emotion);
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).json({ message: "Emotion already exists" });
      }
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteSingleEmotion: async (req, res) => {
    try {
      id = req.params.id;
      if (id.length != 24) {
        return res.status(400).json({ message: "invalid id" });
      }
      let emotion = await EmotionModel.findOne({ _id: req.params.id });

      if (!emotion) {
        return res
          .status(404)
          .json({ message: "emotion not found", id: req.params.id });
      }

      if (emotion.name === "unknown") {
        return res
          .status(400)
          .json({ message: "Cannot delete 'unknown' emotion" });
      }

      emotion = await EmotionModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "success", emotion: emotion });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  createEmotion: async (req, res) => {
    const emotion = req.body;
    if (!emotion) {
      return res.status(400).json({ message: "Emotion is required" });
    }
    if (!emotion.name) {
      return res.status(400).json({ message: "Emotion 'name' is required" });
    }
    // create a new emotion
    try {
      const newEmotion = await EmotionModel.create(emotion);
      res.status(200).json({ message: "success", data: newEmotion });
    } catch (error) {
      if (error.code === 11000 && error.name === "MongoServerError") {
        console.log(error);
        return res.status(400).json({ message: "Emotion already exists" });
      }
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = emotionControllers;
