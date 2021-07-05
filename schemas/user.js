const mongoose = require("mongoose");

const { Schema } = mongoose;
const psotSchema = new Schema({
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
    type: Number,
  },
});
module.exports = mongoose.model("Post", psotSchema);
