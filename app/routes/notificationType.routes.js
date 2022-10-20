const controller = require("../controllers/notification-type.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/lookups/insertAllNotificationTypes",
    controller.insertAllNotificationTypes
  );
  app.get(
    "/api/lookups/getAllNotificationTypes",
    controller.getAllNotificationTypes
  );
};
