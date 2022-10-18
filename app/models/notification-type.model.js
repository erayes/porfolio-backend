const mongoose = require("mongoose");

const NotificationType = mongoose.model(
  "NotificationType",
  new mongoose.Schema({
    _id: String,
    name: {
      en: String,
      ar: String,
    },
  })
);

module.exports = NotificationType;
