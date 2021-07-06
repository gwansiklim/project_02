const mongoose = require("mongoose");

const { Schema } = mongoose;
const writeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Write", writeSchema);
