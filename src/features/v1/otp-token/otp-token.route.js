const express = require("express");
const validate = require("../../../middlewares/validate");
const { otpTokenValidation, otpTokenController } = require("./index");

const router = express.Router();

router
  .route("/verify-otp-token/:userId")
  .post(
    validate(otpTokenValidation.verifyToken),
    otpTokenController.verifyOtpToken
  );

module.exports = router;
