const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: false,
  },
});

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
