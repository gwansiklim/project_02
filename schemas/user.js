const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
  },
  time: {
    type: Date,
    default: new Date(),
  },
});
module.exports = mongoose.model("User", userSchema);
