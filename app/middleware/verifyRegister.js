const db = require("../models");
const User = db.user;

checkDuplicateMobileOrEmail = (req, res, next) => {
  // mobile
  User.findOne({
    mobile: req.body.mobile,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Failed! Mobile is already in use!" });
      return;
    }
    // Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
};

const verifyRegister = {
  checkDuplicateMobileOrEmail,
};

module.exports = verifyRegister;
