const mongoose = require("mongoose");

const Permission = mongoose.model(
  "Permission",
  new mongoose.Schema({
    _id: String,
    reason: String,
    type: {
      _id: String,
      name: {
        en: String,
        ar: String,
      },
    },
    startDate: String,
    endDate: String,
    userID: { type: mongoose.Schema.Types.String, ref: "User" },
    managerID: { type: mongoose.Schema.Types.String, ref: "User" },
    state: String,
    returnedReason: String,
  })
);

module.exports = Permission;
