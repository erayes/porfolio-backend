const db = require("../models");
const Device = db.device;

checkDevice = (req, res, next) => {
  // mobile
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
      next();
    } else {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
  });
};

const verifyDevice = {
  checkDevice,
};

module.exports = verifyDevice;
