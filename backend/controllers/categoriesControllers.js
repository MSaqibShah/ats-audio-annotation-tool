const IntentModel = require("../models/Intent");
const ResponseModel = require("../models/Response");
const EmotionModel = require("../models/Emotion");
const { AUDIO_GENDERS, AUDIO_STATUSES } = require("../models/AudioExt");

module.exports = {
  getAllCategories: async (req, res) => {
    const AUDIO_INTENTS = await IntentModel.find();
    const AUDIO_RESPONSES = await ResponseModel.find();
    const AUDIO_EMOTIONS = await EmotionModel.find();
    let category_data = {
      intents: AUDIO_INTENTS,
      emotions: AUDIO_EMOTIONS,
      genders: AUDIO_GENDERS,
      status: AUDIO_STATUSES,
      responses: AUDIO_RESPONSES,
    };
    res.status(200).json({ message: "success", data: category_data });
  },
};
