const mongoose = require("mongoose");

const Nationality = mongoose.model(
  "Nationality",
  new mongoose.Schema({
    _id: String,
    name: {
      en: String,
      ar: String,
    },
  })
);

module.exports = Nationality;
