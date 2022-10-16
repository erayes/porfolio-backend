const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/user/enableBiometrics",
    [authJwt.verifyToken],
    controller.enableBiometrics
  );

  app.post(
    "/api/user/editAvatar",
    [authJwt.verifyToken],
    controller.editAvatar
  );

  app.get("/api/user/info", [authJwt.verifyToken], controller.info);

  app.post(
    "/api/user/updateFcmToken",
    [authJwt.verifyToken],
    controller.updateFcmToken
  );
};
