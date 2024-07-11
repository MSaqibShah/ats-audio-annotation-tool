const mongoose = require("mongoose");

const entitySchema = new mongoose.Schema({
  entity_key: {
    type: String,
    required: true,
    unique: true,
  },
});

const Entity = mongoose.model("Entity", entitySchema);

module.exports = Entity;
