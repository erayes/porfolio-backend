const controller = require("../controllers/notification.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/notification/send", controller.send);

  app.get(
    "/api/notification/getAllNotificationsByType",
    [authJwt.verifyToken],
    controller.getAllNotificationsByType
  );

  app.post(
    "/api/notification/deleteNotificationByID",
    [authJwt.verifyToken],
    controller.deleteNotificationByID
  );

  app.get(
    "/api/notification/deleteNotificationsByType",
    [authJwt.verifyToken],
    controller.deleteNotificationsByType
  );
};
