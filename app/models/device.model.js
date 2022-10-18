const mongoose = require("mongoose");
const Device = mongoose.model(
  "Device",
  new mongoose.Schema({
    _id: String,
    platform: String,
    version: String,
    userID: { type: mongoose.Schema.Types.String, ref: "User" },
  })
);
module.exports = Device;
