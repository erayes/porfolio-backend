const config = require("../config/auth.config");
const db = require("../models");

const User = db.user;
const Nationality = db.nationality;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const NodeRSA = require("node-rsa");
const { v4: uuidv4 } = require("uuid");

exports.register = (req, res) => {
  const user = new User({
    id: uuidv4(),
    englishName: req.body.englishName,
    arabicName: req.body.arabicName,
    email: req.body.email,
    mobile: req.body.mobile,
    avatar: req.body.avatar,
    nationality: req.body.nationality,
    gender: req.body.gender,
    birthDate: req.body.birthDate,
    fcmToken: req.body.fcmToken,
    publicKey: req.body.publicKey,
    password: bcrypt.hashSync(req.body.password, 8),
    language: req.body.language,
  });

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    return res.send({ message: "User was registered successfully!" });
  });
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    user.language = req.body.language;
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
        language: req.body.language,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
        gender: user.gender,
        birthDate: user.birthDate,
        publicKey: user.publicKey,
        accessToken: token,
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

exports.loginWithBiometrics = (req, res) => {
  console.log("====================================");
  console.log("user id ", req.body.id);
  console.log("====================================");

  User.findOne({ id: req.body.id }, (error, user) => {
    if (error) {
      console.log("500");
      return res.status(500).send({ message: "internal server error" });
    }
    if (!user) {
      console.log("404");
      return res.status(404).send({ message: "User Not found." });
    }
    try {
      const decryptionKey = new NodeRSA(user.publicKey, "public");
      decryptionKey.setOptions({ loginScheme: "sha256" });

      const signature = Buffer.from(req.body.signature, "base64");
      const message = Buffer.from(req.body.id, "utf8");
      let result = decryptionKey.verify(message, signature);

      if (!result) {
        return res.status(404).send({
          accessToken: null,
          message: "Biometric Not Much",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      user.language = req.body.language;
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
          language: req.body.language,
          email: user.email,
          mobile: user.mobile,
          avatar: user.avatar,
          gender: user.gender,
          birthDate: user.birthDate,
          publicKey: user.publicKey,
          accessToken: token,
        };
        Nationality.findOne({ id: user.nationality }, (err, nationality) => {
          if (err || !nationality) {
            userInfo.nationality = null;
          }
          userInfo.nationality = nationality;
          return res.status(200).send(userInfo);
        });
      });
    } catch (we) {
      return res.status(500).send({ message: "internal server error" });
    }
  });
};

exports.logout = (req, res) => {
  // jwt.de;
};
