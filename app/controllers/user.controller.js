const db = require("../models");

const User = db.user;
const Nationality = db.nationality;

exports.enableBiometrics = (req, res) => {
  User.findOne({ id: req?.userId }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    console.log("====================================");
    console.log("user ", user);
    console.log("====================================");
    user.publicKey = req.body.publicKey;
    user.save((error, user) => {
      if (error) {
        return res.status(500).send({ message: error });
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      return res.status(200).send({
        status: "success",
        error: false,
      });
    });
  });
};

exports.editAvatar = (req, res) => {
  User.findOne({ id: req?.userId }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    console.log("====================================");
    console.log("user ", user);
    console.log("====================================");
    user.avatar = req.body.avatar;
    user.save((error, user) => {
      if (error) {
        return res.status(500).send({ message: error });
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      return res.status(200).send({
        status: "success",
        error: false,
      });
    });
  });
};

exports.updateFcmToken = (req, res) => {
  User.findOne({ id: req?.userId }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    user.fcmToken = req.body.fcmToken;
    user.save((error, user) => {
      if (error) {
        return res.status(500).send({ message: error });
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      return res.status(200).send({
        status: "success",
        error: false,
        message: "FCM Token successfully updated",
      });
    });
  });
};

exports.info = (req, res) => {
  console.log("req ", req?.userId);
  // findByPk
  User.findOne({ id: req?.userId }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    console.log("====================================");
    console.log("language ", req.query.language);
    console.log("====================================");

    user.language = req.query.language;

    user.save((error, user) => {
      if (error) {
        return res.status(500).send({ message: error });
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const userInfo = {
        id: user.id,
        arabicName: user.arabicName,
        englishName: user.englishName,
        language: user.language,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
        gender: user.gender,
        birthDate: user.birthDate,
        publicKey: user.publicKey,
      };
      Nationality.findOne({ id: user.nationality }, (err, nationality) => {
        if (err || !nationality) {
          userInfo.nationality = null;
        }
        userInfo.nationality = nationality;
        return res.status(200).send(userInfo);
      });
    });
  });
};
