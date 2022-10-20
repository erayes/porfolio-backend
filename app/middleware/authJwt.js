const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const db = require("../models");
const Device = db.device;

verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(403).send({ message: "No token provided!" });
    return;
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }

    req.userId = decoded._id;
    req.deviceID = decoded.deviceID;

    const query = {
      $or: [{ _id: req?.deviceID }, { userID: req?.userId }],
    };
    Device.find(query).exec((error, devices) => {
      console.log("====================================");
      console.log("query ", query);
      console.log("devices ", devices);
      console.log("length ", devices?.length);
      console.log("====================================");
      if (error) {
        res.status(500).send({ message: error });
        return;
      } else if (
        devices?.length === 1 &&
        devices[0]?.userID === req?.userId &&
        devices[0]?._id === req?.deviceID
      ) {
        setTimeout(() => {
          next();
        }, 2000);
      } else {
        res.status(401).send({
          code: 4010,
          message:
            "Device assigned to an other account or this account has an other device",
        });
        return;
      }
    });
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
