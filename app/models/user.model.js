const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    _id: String,
    englishName: String,
    arabicName: String,
    email: String,
    mobile: String,
    nationality: { type: mongoose.Schema.Types.String, ref: "Nationality" },
    avatar: String,
    gender: String,
    birthDate: String,
    fcmToken: String,
    password: String,
    publicKey: String,
    language: String,
    managerID: { type: mongoose.Schema.Types.String, ref: "User" },
  })
);
module.exports = User;
