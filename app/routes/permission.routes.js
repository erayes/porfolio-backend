const controller = require("../controllers/permission.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/permission/create", [authJwt.verifyToken], controller.create);

  app.get(
    "/api/permission/getAllUserPermissions",
    [authJwt.verifyToken],
    controller.getAllUserPermissions
  );

  app.get(
    "/api/permission/getAllManagerPermissions",
    [authJwt.verifyToken],
    controller.getAllManagerPermissions
  );

  app.post("/api/permission/cancel", [authJwt.verifyToken], controller.cancel);

  app.post(
    "/api/permission/updateState",
    [authJwt.verifyToken],
    controller.updateState
  );

  app.post(
    "/api/permission/updatePermission",
    [authJwt.verifyToken],
    controller.updatePermission
  );
};
