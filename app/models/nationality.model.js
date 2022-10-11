const mongoose = require("mongoose");

const Nationality = mongoose.model(
  "Nationality",
  new mongoose.Schema({
    name: {
      en: String,
      ar: String,
    },
    id: String,
  })
);

module.exports = Nationality;
