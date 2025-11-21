const catchAsync = require("../../../utils/catchAsync");
const otpTokenService = require("./otp-token.service");
const { otpTypes } = require("../../../config/otp");
const httpStatus = require("http-status");
const { generateToken, saveToken } = require("../token/token.service");
const moment = require("moment");
const ApiError = require("../../../utils/ApiError");

const verifyOtpToken = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const { userId } = req.params;
  try {
    await otpTokenService.verifyOtpToken(token, otpTypes.ACCESS, userId);

    const generatedToken = generateToken(
      userId,
      moment().add(10, "minutes"),
      otpTypes.ACCESS
    );

    // if token is valid, proceed to generate a unique identifier for the update operation.
    await saveToken(
      generatedToken,
      userId,
      moment().add(10, "minutes"),
      otpTypes.ACCESS
    );

    res.send({
      message: "OTP verified successfully",
      status: httpStatus.OK,
      id: generatedToken,
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

module.exports = {
  verifyOtpToken,
};
