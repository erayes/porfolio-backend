const mongoose = require("mongoose");

const PermissionState = mongoose.model(
  "PermissionState",
  new mongoose.Schema({
    _id: String,
    name: {
      en: String,
      ar: String,
    },
  })
);

module.exports = PermissionState;
