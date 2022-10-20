const db = require("../models");

const PermissionState = db.permissionState;

exports.insertAllPermissionStates = (req, res) => {
  const permissionStates = req.body.permissionStates;
  PermissionState.insertMany(permissionStates, function (err, response) {
    if (err) {
      res.status(500).send({ message: "We have error" });
      return;
    } else {
      res.status(200).send({
        message: "All permission states were registered successfully!",
      });
      return;
    }
  });
};

exports.getAllPermissionStates = (req, res) => {
  PermissionState.find(function (error, permissionStates) {
    if (error) {
      res.status(500).send({ message: "We have error" });
      return;
    } else {
      res.status(200).send({
        permissionStates,
      });
      return;
    }
  });
};
