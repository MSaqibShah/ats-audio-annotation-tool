const Intent = require("../models/Intent");
const Response = require("../models/Response");
const Emotion = require("../models/Emotion");

async function findOrCreateUnknownIntent() {
  let unknownIntent = await Intent.findOne({ name: "UNKNOWN-INTENT" });
  if (!unknownIntent) {
    unknownIntent = await Intent.create({
      name: "UNKNOWN-INTENT",
      value: "unknown",
    });
  }
  return unknownIntent._id;
}

async function findOrCreateUnknownResponse() {
  let unknownResponse = await Response.findOne({ text: "unknown" });
  if (!unknownResponse) {
    unknownResponse = await Response.create({ text: "unknown" });
  }
  return unknownResponse._id;
}

async function findOrCreateUnknownEmotion() {
  let unknownEmotion = await Emotion.findOne({ name: "unknown" });
  if (!unknownEmotion) {
    unknownEmotion = await Emotion.create({
      name: "unknown",
    });
  }
  return unknownEmotion._id;
}

module.exports = {
  findOrCreateUnknownIntent,
  findOrCreateUnknownResponse,
  findOrCreateUnknownEmotion,
};
