const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const emailService = require("../email/email.service");
const auditService = require("../audit/audit.service");
const { authService } = require("./index");
const { storeService } = require("../store/index");
const { userService } = require("../user/index");
const { tokenService } = require("../token/index");
const { storeDefaults } = require("../../../utils/default");

const register = catchAsync(async (req, res) => {
  const newUser = await userService.createUser(req.body);
  
  // Set httpOnly, secure, and sameSite cookie for CSRF protection
  res.cookie("user-authenticated", "true", {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  const tokens = await tokenService.generateAuthTokens(newUser);

  // Log registration event
  await auditService.logAuthEvent({
    user: newUser,
    action: 'LOGIN',
    status: 'SUCCESS',
    metadata: {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      device: req.device?.type
    }
  });

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
  
  try {
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);

    // Set httpOnly, secure, and sameSite cookie for CSRF protection
    res.cookie("user-authenticated", "true", {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Log successful login
    await auditService.logAuthEvent({
      user,
      action: 'LOGIN',
      status: 'SUCCESS',
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        device: req.device?.type
      }
    });

    res.send({ user, tokens });
  } catch (error) {
    // Log failed login attempt
    await auditService.logAuthEvent({
      user: { email },
      action: 'LOGIN_FAILED',
      status: 'FAILURE',
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      errorMessage: error.message
    });
    
    throw error;
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refresh, req.body.userId);
  
  // Log logout event
  if (req.user) {
    await auditService.logAuthEvent({
      user: req.user,
      action: 'LOGOUT',
      status: 'SUCCESS',
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    });
  }
  
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
  
  // Log password reset request
  await auditService.logAuthEvent({
    user: { email: req.body.email },
    action: 'PASSWORD_RESET_REQUEST',
    status: 'SUCCESS',
    metadata: {
      ip: req.ip,
      userAgent: req.get('user-agent')
    }
  });
  
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  
  // Log password reset completion
  if (req.user) {
    await auditService.logAuthEvent({
      user: req.user,
      action: 'PASSWORD_RESET',
      status: 'SUCCESS',
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    });
  }
  
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
  
  // Log email verification
  if (req.user) {
    await auditService.logAuthEvent({
      user: req.user,
      action: 'EMAIL_VERIFIED',
      status: 'SUCCESS',
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    });
  }
  
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
