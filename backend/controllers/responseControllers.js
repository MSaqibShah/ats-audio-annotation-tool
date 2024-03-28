const ResponseModel = require("../models/Response");

const responseControllers = {
  getSingleResponse: async (req, res) => {
    id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }

    try {
      const response = await ResponseModel.findById(req.params.id);
      if (!response) {
        return res
          .status(404)
          .json({ message: "response not found", id: req.params.id });
      }
      res.status(200).json({ message: "success", response: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getAllResponses: async (req, res) => {
    try {
      const responses = await ResponseModel.find();
      res.status(200).json({ message: "success", responses: responses });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  updateSingleResponse: async (req, res) => {
    id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }

    try {
      const response = await ResponseModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!response) {
        return res
          .status(404)
          .json({ message: "response not found", id: req.params.id });
      }
      res.status(200).json(response);
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).json({ message: "Response already exists" });
      }
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteSingleResponse: async (req, res) => {
    try {
      id = req.params.id;
      if (id.length != 24) {
        return res.status(400).json({ message: "invalid id" });
      }
      let response = await ResponseModel.findOne({ _id: req.params.id });
      if (!response) {
        return res
          .status(404)
          .json({ message: "response not found", id: req.params.id });
      }

      if (response.text == "unknown") {
        return res
          .status(400)
          .json({ message: "Cannot delete 'unknown' response" });
      }

      response = await ResponseModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "success", response: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  createResponse: async (req, res) => {
    const response = req.body;
    if (!response) {
      return res.status(400).json({ message: "Response is required" });
    }
    if (!response.text) {
      return res.status(400).json({ message: "Response 'text' is required" });
    }
    // create a new response
    try {
      const newResponse = await ResponseModel.create(response);
      res.status(200).json({ message: "success", data: newResponse });
    } catch (error) {
      if (error.code === 11000 && error.name === "MongoServerError") {
        console.log(error);
        return res.status(400).json({ message: "Response already exists" });
      }
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = responseControllers;
