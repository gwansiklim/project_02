const mongoose = require("mongoose");

const { Schema } = mongoose;
const postSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Post", postSchema);
