const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.nationality = require("./nationality.model");
db.nationality = require("./nationality.model");
db.notification = require("./notification.model");
db.permission = require("./permission.model");
db.device = require("./device.model");

module.exports = db;
