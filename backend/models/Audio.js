const mongoose = require("mongoose");

const UNKNOWN = "unknown";
const AUDIO_EMOTIONS = ["happy", "sad", "angry", "neutral", "unknown"];
const AUDIO_GENDERS = ["male", "female", "unknown"];
const AUDIO_STATUSES = [
  "waiting",
  "processing",
  "completed",
  "missing-information",
];
const AUDIO_STATUS_DEFAULT = "waiting";

const audioSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  transcription: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    default: UNKNOWN,
    enum: AUDIO_GENDERS,
  },
  emotions: {
    type: String,
    required: true,
    default: UNKNOWN,
    enum: AUDIO_EMOTIONS,
  },
  intent: {
    type: String,
    required: false,
  },
  best_response: {
    type: String,
    required: false,
  },
  better_response: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    default: AUDIO_STATUS_DEFAULT,
    enum: AUDIO_STATUSES,
  },
});

const Audio = mongoose.model("Audio", audioSchema);

module.exports = {
  Audio,
  AUDIO_EMOTIONS,
  AUDIO_GENDERS,
  AUDIO_STATUSES,
};
