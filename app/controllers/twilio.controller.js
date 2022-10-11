require("dotenv").config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

exports.sendOtp = async (req, res, next) => {
  const { countryCode, phoneNumber } = req.body;
  var code = Math.floor(1000 + Math.random() * 9000);

  client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verifications.create({
      to: `+${countryCode}${phoneNumber}`,
      channel: "sms",
      // customCode: `${code}`,
      // customMessage: "Hello",
      // customFriendlyName: "Errayes",
    })
    .then((response) => {
      console.log("send res ", response);
      res
        .status(200)
        .send(`OTP sent successfully: ${JSON.stringify(response)}`);
    })
    .catch((error) => {
      console.log("send error ", error);
      res.status(500).send(`Internal server error`);
    });
};

exports.verifyOtp = (req, res, next) => {
  const { countryCode, phoneNumber, code } = req.body;

  client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: `+${countryCode}${phoneNumber}`,
      code: code,
    })
    .then((verification) => {
      console.log(verification.accountSid);
      res
        .status(200)
        .send(`OTP verified successfully: ${JSON.stringify(verification)}`);
    });
};
