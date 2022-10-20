const config = require("../config/auth.config");
const db = require("../models");

const User = db.user;
const Device = db.device;
const Nationality = db.nationality;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const NodeRSA = require("node-rsa");
const { v4: uuidv4 } = require("uuid");

exports.register = (req, res) => {
  const user = new User({
    _id: uuidv4(),
    englishName: req.body.englishName || "",
    arabicName: req.body.arabicName || "",
    email: req.body.email,
    mobile: req.body.mobile,
    avatar: req.body.avatar || "",
    nationality: req.body.nationality,
    gender: req.body.gender || "",
    birthDate: req.body.birthDate || "",
    fcmToken: req.body.fcmToken || "",
    publicKey: req.body.publicKey || "",
    password: bcrypt.hashSync(req.body.password, 8),
    language: req.body.language || "",
    managerID: req.body.managerID || "",
    nat: "634c77a531ab49a2d8ce08b0",
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
  })
    .populate("nationality", {
      _id: 1,
      name: 1,
    })
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      Device.find(
        { $or: [{ _id: req?.body?.deviceID }, { userID: user._id }] },
        (error, devices) => {
          console.log("====================================");
          console.log("length ", devices?.length);
          console.log("devices ", devices);
          console.log("====================================");
          if (error) {
            return res.status(500).send({ message: error });
          } else if (
            devices?.length === 0 ||
            (devices?.length === 1 &&
              devices[0]?.userID === user._id &&
              devices[0]?._id === req?.body?.deviceID)
          ) {
            const userInfo = {
              _id: user._id,
              arabicName: user.arabicName,
              englishName: user.englishName,
              language: req.body.language,
              email: user.email,
              mobile: user.mobile,
              avatar: user.avatar,
              gender: user.gender,
              birthDate: user.birthDate,
              publicKey: user.publicKey,
              nationality: user.nationality,
            };

            if (devices?.length === 0) {
              const NewDevice = new Device({
                _id: req?.body?.deviceID,
                userID: user._id,
              });

              const createDevice = NewDevice.save();
              user.language = req.body.language;
              const saveUser = user.save();
              Promise.all([saveUser, createDevice]).then(([user, dev]) => {
                console.log("user ", user);
                console.log("dev ", dev);

                var token = jwt.sign(
                  { _id: user._id, deviceID: dev?._id },
                  config.secret,
                  {
                    expiresIn: 86400, // 24 hours
                  }
                );
                userInfo.accessToken = token;
                return res.status(200).send(userInfo);
              });
            } else {
              var token = jwt.sign(
                { _id: user._id, deviceID: devices[0]?._id },
                config.secret,
                {
                  expiresIn: 86400, // 24 hours
                }
              );
              userInfo.accessToken = token;
              return res.status(200).send(userInfo);
            }
          } else {
            return res.status(400).send({
              code: 4001,
              message:
                "Device assigned to an other account or this account has an other device",
            });
          }
        }
      );
    });
};

exports.loginWithBiometrics = (req, res) => {
  console.log("====================================");
  console.log("user id ", req.body._id);
  console.log("====================================");

  User.findOne({ _id: req.body._id })
    .populate("nationality", {
      _id: 1,
      name: 1,
    })
    .exec((error, user) => {
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
        const message = Buffer.from(req.body._id, "utf8");
        let result = decryptionKey.verify(message, signature);

        if (!result) {
          return res.status(404).send({
            accessToken: null,
            message: "Biometric Not Much",
          });
        }

        var token = jwt.sign({ _id: user._id }, config.secret, {
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
            _id: user._id,
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
          Nationality.findOne({ _id: user.nationality }, (err, nationality) => {
            if (err || !nationality) {
              userInfo.nationality = null;
            }
            userInfo.nationality = nationality;
            return res.status(200).send(userInfo);
          });
        });
      } catch (e) {
        return res.status(500).send({ message: "internal server error" });
      }
    });
};

exports.logout = (req, res) => {
  // jwt.de;
};
