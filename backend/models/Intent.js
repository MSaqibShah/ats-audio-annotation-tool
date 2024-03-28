const mongoose = require("mongoose");

const intentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const Intent = mongoose.model("Intent", intentSchema);

module.exports = Intent;
