const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    id: String,
    englishName: String,
    arabicName: String,
    email: String,
    mobile: String,
    nationality: String,
    avatar: String,
    gender: String,
    birthDate: String,
    fcmToken: String,
    password: String,
    publicKey: String,
    language: String,
    managerID: String,
  })
);
module.exports = User;
