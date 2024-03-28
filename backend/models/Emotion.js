const mongoose = require("mongoose");

const emotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Emotion = mongoose.model("Emotion", emotionSchema);

module.exports = Emotion;
