const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
// const db = require("../models");

verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  console.log("====================================");
  console.log("token ", token);
  console.log("====================================");
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    console.log("decoded ==> ", decoded);
    // next();

    setTimeout(() => {
      // Delay this action by one second
      next();
    }, 2000);
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
