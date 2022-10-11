const { admin } = require("../config/firebase-config");
const db = require("../models");
const { v4: uuidv4 } = require("uuid");

const Notification = db.notification;

const notification_options = {
  contentAvailable: true,
  priority: "high",
};

exports.send = (req, res) => {
  const registrationToken = req.body.registrationToken;
  const message = {
    notification: {
      title: req.body.title.ar,
      body: req.body.body.ar,
      sound: "default",
    },
  };
  const notification = {
    id: uuidv4(),
    title: req.body.title,
    body: req.body.body,
    type: req.body.type,
    userID: req.body.userID,
  };
  admin
    .messaging()
    .sendToDevice(registrationToken, message, notification_options)
    .then((response) => {
      Notification.insertMany(notification, function (err, response) {
        if (err) {
          res
            .status(500)
            .send({ message: "We have error when we create notification" });
          return;
        } else {
          res.status(200).send("Notification sent successfully");
        }
      });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ message: "We have error when we send notification" });
    });
};

exports.getAllNotificationsByType = (req, res) => {
  var query = { type: req.query.type, userID: req?.userId };
  Notification.find(query, function (err, notifications) {
    if (err) return res.status(500).send({ message: "We have error" });
    return res.status(200).send({
      notifications,
    });
  });
};

exports.deleteNotificationByID = (req, res) => {
  var query = { userID: req?.userId, id: req.body.id };
  Notification.deleteOne(query, function (err, obj) {
    if (err) return res.status(500).send({ message: "We have error" });
    return res.status(200).send({
      status: "success",
      error: false,
      data: obj,
    });
  });
};

exports.deleteNotificationsByType = (req, res) => {
  var query = { userID: req?.userId, type: req.query.type };
  Notification.remove(query, function (err, obj) {
    if (err) return res.status(500).send({ message: "We have error" });
    return res.status(200).send({
      status: "success",
      message: `delete all ${req.query.type} notifications success`,
      error: false,
      data: obj,
    });
  });
};
