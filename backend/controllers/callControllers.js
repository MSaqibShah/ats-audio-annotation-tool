const { get } = require("mongoose");
const { Call: CallModel, CALL_STATUSES } = require("../models/Call");
const { Audio: AudioModel } = require("../models/AudioExt");
const IntentModel = require("../models/Intent");
const ResponseModel = require("../models/Response");
const EmotionModel = require("../models/Emotion");
const { deleteSingleAudio } = require("./audioControllers");
const { v4: uuidv4 } = require("uuid");

function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

module.exports = {
  getAllCalls: async (req, res) => {
    try {
      let calls = await CallModel.find();
      // calls = calls.map((call) => {

      // });
      for (let i = 0; i < calls.length; i++) {
        calls[i] = calls[i].toObject();
        let audios = await AudioModel.find({ call_id: calls[i].call_id })
          .populate("nlp.intent")
          .populate("nlp.best_response")
          .populate("nlp.emotion");

        if (!audios) {
          calls[i]["audios"] = [];
        } else {
          calls[i]["audios"] = audios;
        }
      }

      res.status(200).json({ message: "success", data: calls });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  getSingleCall: async (req, res) => {
    let call_id = req.params.call_id;
    // check uuid is valid

    if (!isValidUUID(call_id)) {
      return res
        .status(400)
        .json({ message: "invalid call_id, should be a valid uuid" });
    }
    // convert id string to uuid
    // call_id = uuidv4(call_id);

    try {
      let call = await CallModel.findOne({ call_id: call_id });
      if (!call) {
        return res
          .status(404)
          .json({ message: "call not found", call_id: call_id });
      }
      call = call.toObject();
      let audios = await AudioModel.find({ call_id: call_id })
        .populate("nlp.intent")
        .populate("nlp.best_response")
        .populate("nlp.emotion");

      if (!audios) {
        call["audios"] = [];
      } else {
        call["audios"] = audios;
      }
      res.status(200).json({ message: "success", data: call });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  createCall: async (req, res) => {
    try {
      //  get data from request
      const data = req.body;
      if (!data) {
        return res.status(400).json({ message: "Call data cannot be empty" });
      }

      if (!data.call_id) {
        return res.status(400).json({ message: "Call ID is required" });
      }

      // check uuid
      if (!isValidUUID(data.call_id)) {
        return res
          .status(400)
          .json({ message: "invalid call_id, should be a valid uuid" });
      }

      const call = new CallModel({
        call_id: data.call_id,
      });
      await call.save();
      res.status(201).json({ message: "success", data: call });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  updateSingleCall: async (req, res) => {
    const call_id = req.params.call_id;
    const data = req.body;
    if (!isValidUUID(call_id)) {
      return res
        .status(400)
        .json({ message: "invalid call_id, should be a valid uuidv4" });
    }

    if (!data) {
      return res.status(400).json({ message: "Call data cannot be empty" });
    }

    try {
      const call = await CallModel.findOne({ call_id: call_id });
      if (!call) {
        return res
          .status(404)
          .json({ message: "call not found", call_id: call_id });
      }

      if (data.status) {
        if (!CALL_STATUSES.includes(data.status)) {
          return res.status(400).json({
            message:
              "invalid status, should be one of 'pending' or 'completed'",
          });
        }
        call.status = data.status;
      }

      if (data.call_id) {
        // check uuid
        if (!isValidUUID(data.call_id)) {
          return res
            .status(400)
            .json({ message: "invalid call_id, should be a valid uuid" });
        }

        // update audios
        await AudioModel.updateMany(
          { call_id: call.call_id },
          { call_id: data.call_id }
        );
        call.call_id = data.call_id;
      }

      await call.save();

      res.status(200).json({ message: "success", data: call });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteSingleCall: async (req, res) => {
    const call_id = req.params.call_id;
    if (!isValidUUID(call_id)) {
      return res
        .status(400)
        .json({ message: "invalid id, should be a valid uuidv4" });
    }

    try {
      const call = await CallModel.findOneAndDelete({ call_id: call_id });

      if (!call) {
        return res
          .status(404)
          .json({ message: "call not found", call_id: call_id });
      }
      const audios = await AudioModel.find({ call_id: call_id });

      if (audios) {
        audios.forEach(async (audio) => {
          await AudioModel.findByIdAndDelete(audio._id);
        });
      }
      res.status(200).json({ message: "success", data: call });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getSingleCallByIndex: async (req, res) => {
    let index = req.params.index;
    index = parseInt(index);
    if (isNaN(index)) {
      res.status(500).json({ message: "Index should be an integer" });
    }

    try {
      let call = await CallModel.findOne({ index: index });
      if (!call) {
        return res
          .status(404)
          .json({ message: "call not found", index: req.params.index });
      }
      call = call.toObject();
      let audios = await AudioModel.find({ call_id: call.call_id })
        .populate("nlp.intent")
        .populate("nlp.best_response")
        .populate("nlp.emotion");

      if (!audios) {
        call["audios"] = [];
      } else {
        call["audios"] = audios;
      }
      res.status(200).json({ message: "success", data: call });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
