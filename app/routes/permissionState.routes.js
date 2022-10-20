const controller = require("../controllers/permission-state.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/lookups/insertAllPermissionStates",
    controller.insertAllPermissionStates
  );
  app.get(
    "/api/lookups/getAllPermissionStates",
    controller.getAllPermissionStates
  );
};
