const mongoose = require("mongoose");

const PermissionType = mongoose.model(
  "PermissionType",
  new mongoose.Schema({
    _id: String,
    name: {
      en: String,
      ar: String,
    },
  })
);

module.exports = PermissionType;
