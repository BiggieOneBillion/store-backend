const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const emailService = require("../email/email.service");
const { authService } = require("./index");
const { storeService } = require("../store/index");
const { userService } = require("../user/index");
const { tokenService } = require("../token/index");
const { storeDefaults } = require("../../../utils/default");

const register = catchAsync(async (req, res) => {
  const newUser = await userService.createUser(req.body);
  // if (req.body.role === "seller") {
  //   await storeService.createStore({
  //     ...storeDefaults,
  //     owner: newUser._id,
  //   });
  // }
  // Set httpOnly, secure, and sameSite cookie for CSRF protection
  res.cookie("user-authenticated", "true", {
    // httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
    // sameSite: "strict", // helps protect against CSRF
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  const tokens = await tokenService.generateAuthTokens(newUser);

  const newUserInfo = {
    id: newUser.id,
    name: newUser.name,
    role: newUser.role,
    email: newUser.email,
  };

  res.status(httpStatus.CREATED).send({ newUser: newUserInfo, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  // Set httpOnly, secure, and sameSite cookie for CSRF protection
  res.cookie("user-authenticated", "true", {
    // httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
    // sameSite: "strict", // helps protect against CSRF
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refresh, req.body.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const loginStatus = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  loginStatus,
};
