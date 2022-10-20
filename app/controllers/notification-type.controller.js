const db = require("../models");

const NotificationType = db.notificationType;

exports.insertAllNotificationTypes = (req, res) => {
  const notificationTypes = req.body.notificationTypes;

  NotificationType.insertMany(notificationTypes, function (err, response) {
    if (err) {
      res.status(500).send({ message: "We have error" });
      return;
    } else {
      res.status(200).send({
        message: "All notification types were registered successfully!",
      });
      return;
    }
  });
};

exports.getAllNotificationTypes = (req, res) => {
  NotificationType.find(function (error, notificationTypes) {
    if (error) {
      return res.status(500).send({ message: "We have error" });
    } else {
      return res.status(200).send({
        notificationTypes,
      });
    }
  });
};
