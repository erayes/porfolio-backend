const db = require("../models");

const PermissionType = db.permissionType;

exports.insertAllPermissionTypes = (req, res) => {
  const permissionTypes = req.body.permissionTypes;
  db.permissionType.insertMany(permissionTypes, function (err, response) {
    console.log("====================================");
    console.log("err ", err);
    console.log("response ", response);
    console.log("====================================");
    if (err) {
      res.status(500).send({ message: "We have error" });
      return;
    } else {
      res.status(200).send({
        message: "All permission types were registered successfully!",
      });
      return;
    }
  });
};

exports.getAllPermissionTypes = (req, res) => {
  PermissionType.find(function (error, permissionTypes) {
    if (error) {
      res.status(500).send({ message: "We have error" });
      return;
    } else {
      res.status(200).send({
        permissionTypes,
      });
      return;
    }
  });
};
