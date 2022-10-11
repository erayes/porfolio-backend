const mongoose = require("mongoose");

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema({
    id: String,
    title: {
      en: String,
      ar: String,
    },
    body: {
      en: String,
      ar: String,
    },
    userID: String,
    type: String,
  })
);

module.exports = Notification;
