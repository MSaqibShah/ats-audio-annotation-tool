const { model } = require("mongoose");
const IntentModel = require("../models/Intent");

const intentControllers = {
  getSingleIntent: async (req, res) => {
    id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }

    try {
      const intent = await IntentModel.findById(req.params.id);
      if (!intent) {
        return res
          .status(404)
          .json({ message: "intent not found", id: req.params.id });
      }
      res.status(200).json({ message: "success", intent: intent });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getAllIntents: async (req, res) => {
    try {
      const intents = await IntentModel.find();
      res.status(200).json({ message: "success", intents: intents });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  updateSingleIntent: async (req, res) => {
    id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }

    try {
      const intent = await IntentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!intent) {
        return res
          .status(404)
          .json({ message: "intent not found", id: req.params.id });
      }
      res.status(200).json(intent);
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).json({ message: "Intent already exists" });
      }
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteSingleIntent: async (req, res) => {
    try {
      id = req.params.id;
      if (id.length != 24) {
        return res.status(400).json({ message: "invalid id" });
      }
      let intent = await IntentModel.findOne({ _id: req.params.id });
      if (!intent) {
        return res
          .status(404)
          .json({ message: "intent not found", id: req.params.id });
      }

      if (intent.name === "UNKNOWN-INTENT") {
        return res
          .status(400)
          .json({ message: "Cannot delete 'UNKNOWN-INTENT'" });
      }
      intent = await IntentModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "success", intent: intent });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  createIntent: async (req, res) => {
    const intent = req.body;
    if (!intent) {
      return res.status(400).json({ message: "Intent is required" });
    }
    if (!intent.name) {
      return res.status(400).json({ message: "Intent name is required" });
    }
    if (!intent.value) {
      return res.status(400).json({ message: "Intent value is required" });
    }

    // create a new intent
    try {
      const newIntent = await IntentModel.create(intent);
      res.status(200).json({ message: "success", data: newIntent });
    } catch (error) {
      if (error.code === 11000 && error.name === "MongoServerError") {
        return res.status(400).json({ message: "Intent already exists" });
      } else {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
      }
    }
  },
  getSingleIntentByName: async (req, res) => {
    try {
      const intent = await IntentModel.findOne({
        name: req.params.intent_name,
      });
      if (!intent) {
        return res
          .status(404)
          .json({ message: "intent not found", name: req.params.intent_name });
      }
      res.status(200).json({ message: "success", intent: intent });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = intentControllers;
