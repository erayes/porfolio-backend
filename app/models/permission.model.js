const mongoose = require("mongoose");

const Permission = mongoose.model(
  "Permission",
  new mongoose.Schema({
    id: String,
    reason: String,
    type: {
      id: Number,
      name: {
        en: String,
        ar: String,
      },
    },
    startDate: String,
    endDate: String,
    userID: Object,
    managerID: String,
    state: String,
    returnedReason: String,
  })
);

module.exports = Permission;
