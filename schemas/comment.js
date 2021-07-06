const mongoose = require("mongoose");

const { Schema } = mongoose;
const commentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  write: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});
module.exports = mongoose.model("Comment", commentSchema);
