const controller = require("../controllers/permission-type.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/lookups/insertAllPermissionTypes",
    controller.insertAllPermissionTypes
  );
  app.get(
    "/api/lookups/getAllPermissionTypes",
    controller.getAllPermissionTypes
  );
};
