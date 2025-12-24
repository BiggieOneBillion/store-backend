const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const { userService } = require("./index");
const { sendEmail } = require("../email/email.service");
const otpTokenService = require("../otp-token/otp-token.service");
const tokenService = require("../token/token.service");
const { otpTypes } = require("../../../config/otp");
const moment = require("moment");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.send(users);
});

const getUserRole = catchAsync(async (req, res) => {
  
  const role = await userService.getUserRoleById(req.params.userId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send({ role });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  // console.log("REQ BODY", req.body);
  if (!req.body.token) {
    // first reauthenticate user, by asking for their password
    // get user details
    const user = await userService.getUserById(req.params.userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const otpToken = otpTokenService.generateOtpToken();

    console.log("OTP TOKEN", otpToken);
    // if user found, then generate otp and send to their email
    await sendEmail(
      user.email,
      "Your OTP Code",
      `Your OTP code is ${otpToken}. It will expire in 10 minutes.`
    );
    // save otp token to db
    await otpTokenService.saveOtpToken(
      //! point of failure
      otpToken,
      user.id,
      moment().add(10, "minutes"),
      otpTypes.ACCESS
    );
    console.log("otp saved to db");
    // inform user to check their email for the otp
    res.send({
      message: "Check Your Email to get the OTP to update your profile",
      status: httpStatus.OK,
    });
  } else {
    // verify OTP token
    try {
      await tokenService.verifyToken(
        req.body.token,
        otpTypes.ACCESS,
        // req.params.userId
      );
      // then allow them to update their profile
      const updatedUser = await userService.updateUserById(
        req.params.userId,
        req.body
      );
      res.send(updatedUser);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
    }
  }

  // send OTP to user's email or phone
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserRole
};
