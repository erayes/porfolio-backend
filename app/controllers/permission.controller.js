const db = require("../models");
const { v4: uuidv4 } = require("uuid");

const Permission = db.permission;

const { sendNotifications } = require("./global");

exports.create = (req, res) => {
  const data = req.body;

  Permission.insertMany(
    {
      ...data,
      state: "draft",
      userID: req?.userId,
      _id: uuidv4(),
    },
    (err, response) => {
      if (err) {
        res
          .status(500)
          .send({ message: "We have error when we create permission" });
        return;
      } else {
        res.status(200).send({
          data: response,
          status: "success",
          error: false,
          message: "Permission create successfully",
        });
        return;
      }
    }
  );
};

exports.getAllUserPermissions = (req, res) => {
  var query = { userID: req?.userId };
  Permission.find(query, (err, permissions) => {
    if (err) {
      res.status(500).send({ message: "We have error" });
      return;
    }
    res.status(200).send({
      data: permissions,
      status: "success",
      error: false,
      message: "Get all user permissions successfully",
    });
    return;
  });
};

exports.getAllManagerPermissions = (req, res) => {
  var query = { managerID: req?.userId, state: { $ne: "canceled" } };

  Permission.find(query)
    .populate("userID", {
      _id: 0,
      email: 1,
      mobile: 1,
      englishName: 1,
      arabicName: 1,
    })
    .exec((err, permissions) => {
      if (err) {
        res.status(500).send({ message: "We have error" });
        return;
      }
      res.status(200).send({ permissions });

      return;
    });
};

exports.cancel = (req, res) => {
  var query = {
    userID: req?.userId,
    _id: req.body._id,
  };
  Permission.findOne(query, (err, permission) => {
    if (err) {
      res.status(500).send({ message: "We have error" });
      return;
    } else if (!permission) {
      res.status(400).send({ code: 400, message: "Permission not found" });
      return;
    } else {
      let message = "";
      if (permission.state === "canceled") {
        message = "The permission already canceled";
      } else if (
        permission.state != "draft" &&
        permission.state != "returned"
      ) {
        message = `the permission was  ${permission.state} you can not canceled it`;
      }
      if (message) {
        res.status(200).send({
          status: "fail",
          error: true,
          data: permission,
          message,
        });
        return;
      } else {
        permission.state = "canceled";
        permission.save((err, response) => {
          if (err) {
            res.status(500).send({ message: "We have error" });
            return;
          } else {
            res.status(200).send({
              status: "success",
              error: false,
              data: response,
              message: "Permission was canceled successfully",
            });

            return;
          }
        });
      }
    }
  });
};

exports.updatePermission = (req, res) => {
  var query = {
    userID: req?.userId,
    _id: req.body._id,
  };
  Permission.findOne(query, (err, permission) => {
    if (err) {
      res.status(500).send({ message: "We have error" });
      return;
    } else if (!permission) {
      res.status(400).send({ message: "Permission not found" });
      return;
    } else {
      if (permission.state != "draft" && permission.state != "returned") {
        res.status(200).send({
          status: "fail",
          error: true,
          permission,
          message: `You can not update ${permission.state} permission request`,
        });
        return;
      } else {
        if (permission.state === "returned") {
          permission.state = "draft";
        }
        permission.reason = req.body.reason;
        permission.type = req.body.type;
        permission.startDate = req.body.startDate;
        permission.endDate = req.body.endDate;

        permission.save((err, response) => {
          if (err) {
            res.status(500).send({ message: "We have error" });
            return;
          } else {
            res.status(200).send({
              status: "success",
              error: false,
              data: response,
              message: "Permission was updated successfully",
            });
            return;
          }
        });
      }
    }
  });
};

exports.updateState = (req, res) => {
  console.log("====================================");
  console.log("managerID ", req?.userId);
  console.log("====================================");

  var query = { managerID: req?.userId, _id: req.body._id };

  const newState = req.body.state;
  Permission.findOne(query, (err, permission) => {
    if (err) {
      console.log("error ", err);
      res.status(500).send({ message: "We have error" });
      return;
    } else if (!permission) {
      res.status(400).send({ code: 4001, message: "Permission not found" });
      return;
    } else {
      let message = "";

      if (
        newState != "approved" &&
        newState != "rejected" &&
        newState != "returned"
      ) {
        message = "You can only approve, reject or return permission";
      } else if (newState === "approved" && permission.state === "approved") {
        message = "The permission already approved";
      } else if (newState === "approved" && permission.state != "draft") {
        message = `the permission was  ${permission.state} you can not approved it`;
      } else if (newState === "rejected" && permission.state === "rejected") {
        message = "The permission already rejected";
      } else if (newState === "rejected" && permission.state != "draft") {
        message = `the permission was  ${permission.state} you can not rejected it`;
      } else if (newState === "returned" && permission.state === "returned") {
        message = "The permission already returned";
      } else if (newState === "returned" && permission.state != "draft") {
        message = `the permission was  ${permission.state} you can not returned it`;
      }

      if (message) {
        res.status(200).send({
          status: "fail",
          error: true,
          data: permission,
          message,
        });
        return;
      } else {
        permission.state = newState;
        if (newState === "returned") {
          if (req?.body?.returnedReason)
            permission.returnedReason = req.body.returnedReason;
          else {
            res.status(400).send({
              code: 4003,
              message: "missed returned reason",
            });
            return;
          }
        }
        permission.save((err, response) => {
          if (err) {
            res.status(500).send({ message: "We have error" });
            return;
          } else if (!response) {
            res
              .status(400)
              .send({ code: 4004, message: "Permission not found" });
            return;
          } else {
            sendNotifications(
              [permission.userID],
              "Permission Request",
              `Your permission #34465-345434 has been ${newState}`,
              "private"
            );
            res.status(200).send({
              status: "success",
              error: false,
              data: response,
              message: `Permission was ${newState} successfully`,
            });
            return;
          }
        });
      }
    }
  });
};
