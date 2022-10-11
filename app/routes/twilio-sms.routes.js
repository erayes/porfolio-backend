const controller = require("../controllers/twilio.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/auth/sendOtp", controller.sendOtp);
  app.post("/api/auth/verifyOtp", controller.verifyOtp);
};
