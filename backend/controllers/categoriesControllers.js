const IntentModel = require("../models/Intent");
const {
  AUDIO_EMOTIONS,
  AUDIO_GENDERS,
  AUDIO_STATUSES,
  AUDIO_RESPONSES,
} = require("../models/AudioExt");

module.exports = {
  getAllCategories: async (req, res) => {
    const AUDIO_INTENTS = await IntentModel.find();

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
