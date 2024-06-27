const mongoose = require("mongoose");
const {
  findOrCreateUnknownIntent,
  findOrCreateUnknownResponse,
  findOrCreateUnknownEmotion,
} = require("../utilities/findOrCreateUtility");

const UNKNOWN = "unknown";
const AUDIO_STATUS_DEFAULT = "pending";
// const AUDIO_EMOTIONS = ["happy", "sad", "angry", "neutral", UNKNOWN];
const AUDIO_GENDERS = ["male", "female", UNKNOWN];
const AUDIO_STATUSES = [AUDIO_STATUS_DEFAULT, "completed"];

const nlpSchema = new mongoose.Schema({
  emotion: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Emotion",
  },
  gender: {
    type: String,
    required: false,
    enum: AUDIO_GENDERS,
    default: UNKNOWN,
  },
  intent: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Intent",
  },
  best_response: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Response",
  },
  better_response: {
    type: String,
    required: false,
  },
  entities: {
    type: [
      {
        entity: String,
        text: String,
        label: String,
      },
    ],

    required: false,
    default: [],
  },
});

const audioSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: false,
  },
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
  author: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

audioSchema.pre("save", async function (next) {
  if (this.index === undefined) {
    this.index = await Audio.countDocuments();
  }
  if (this.isNew) {
    if (!this.nlp) {
      this.nlp = {};
    }

    if (!this.nlp.intent) {
      this.nlp.intent = await findOrCreateUnknownIntent();
    }

    if (!this.nlp.best_response) {
      this.nlp.best_response = await findOrCreateUnknownResponse();
    }

    if (!this.nlp.emotion) {
      this.nlp.emotion = await findOrCreateUnknownEmotion();
    }
  }
  next();
});

const Audio = mongoose.model("Audio", audioSchema);

module.exports = {
  Audio,
  AUDIO_GENDERS,
  AUDIO_STATUSES,
};
