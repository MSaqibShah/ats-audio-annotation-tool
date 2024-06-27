const { UUID } = require("mongodb");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const CALL_STATUSES = ["pending", "completed"];

const callSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: false,
  },
  call_id: {
    type: UUID,
    required: true,
  },
  created_at: {
    // set it to the current datetime when a new document is created
    type: Date,
    default: Date.now,
  },
  updated_at: {
    // set it to the current datetime
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: CALL_STATUSES,
  },
});

callSchema.pre("save", async function (next) {
  try {
    // set the updated_at field to the current date
    this.updated_at = new Date();

    // count documents in the collection
    if (this.index === undefined) {
      this.index = await Call.countDocuments();
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Call = mongoose.model("Call", callSchema);

module.exports = { Call, CALL_STATUSES };
