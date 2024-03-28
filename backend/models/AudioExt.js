const mongoose = require("mongoose");

const UNKNOWN = "unknown";
const AUDIO_STATUS_DEFAULT = "waiting";
const AUDIO_EMOTIONS = ["happy", "sad", "angry", "neutral", UNKNOWN];
const AUDIO_GENDERS = ["male", "female", UNKNOWN];
const AUDIO_STATUSES = [
  AUDIO_STATUS_DEFAULT,
  "processing",
  "completed",
  "missing-information",
];

const AUDIO_RESPONSES = ["yes", "no", UNKNOWN];

const AUDIO_INTENTS = ["positive", "negative", "neutral", UNKNOWN];

const nlpSchema = new mongoose.Schema({
  emotion: {
    type: String,
    required: false,
    enum: AUDIO_EMOTIONS,
    default: UNKNOWN,
  },
  gender: {
    type: String,
    required: false,
    enum: AUDIO_GENDERS,
    default: UNKNOWN,
  },
  intent: {
    type: String,
    required: false,
    ref: "Intent",
    // enum: AUDIO_INTENTS,
    default: UNKNOWN,
  },
  best_response: {
    type: String,
    required: false,
    enum: AUDIO_RESPONSES,
    default: UNKNOWN,
  },
  better_response: {
    type: String,
    required: false,
  },
});

const audioSchema = new mongoose.Schema({
  audio: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  nlp: {
    type: nlpSchema,
    required: false,
    default: {
      emotion: UNKNOWN,
      gender: UNKNOWN,
      intent: UNKNOWN,
      best_response: UNKNOWN,
      better_response: "",
    },
  },
  level: {
    type: Number,
    required: false,
  },
  intent: {
    type: String,
    required: false,
  },
  lang: {
    type: String,
    required: false,
  },
  interuptions: {
    type: String,
    required: false,
  },
  call_id: {
    type: mongoose.Schema.Types.UUID,
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
  AUDIO_INTENTS,
  AUDIO_RESPONSES,
};
