"use strict";

const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { admin } = require("../config/firebase-config");

const User = db.user;
const Notification = db.notification;

const notification_options = {
  contentAvailable: true,
  priority: "high",
};

exports.sendNotifications = (userIDs, title, body, type) => {
  console.log("start send notif ");

  User.find(
    {
      _id: {
        $in: userIDs,
      },
      fcmToken: { $ne: null },
      fcmToken: { $ne: "" },
    },
    (error, users) => {
      if (error) {
        console.log("error ", error);
      } else {
        console.log("users ", users);
        users.forEach((element) => {
          console.log(element);
          const message = {
            notification: {
              title: title,
              body: body,
              sound: "default",
            },
          };

          const notification = {
            _id: uuidv4(),
            title: title,
            body: body,
            type: type,
            userID: element._id,
          };

          admin
            .messaging()
            .sendToDevice(element.fcmToken, message, notification_options)
            .then((response) => {
              Notification.insertMany(notification, function (err, response) {
                if (err) {
                  console.log(
                    "We have error when we create notification ",
                    err
                  );
                } else {
                  console.log("Notification sent successfully ", response);
                }
              });
            })
            .catch((error) => {
              console.log("We have error when we send notification ", error);
            });
        });
      }
    }
  );
};
