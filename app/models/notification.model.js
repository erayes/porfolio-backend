const mongoose = require("mongoose");

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema({
    _id: String,
    title: {
      en: String,
      ar: String,
    },
    body: {
      en: String,
      ar: String,
    },
    userID: { type: mongoose.Schema.Types.String, ref: "User" },
    type: String,
  })
);

module.exports = Notification;
