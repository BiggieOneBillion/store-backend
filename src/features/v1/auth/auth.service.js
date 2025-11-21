const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const { tokenTypes } = require("../../../config/tokens");
const { userService } = require("../user/index");
const { tokenService } = require("../token/index");
const Token = require("../token/token.model");
const bcrypt = require("bcryptjs");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // const newUser = await userService.getUserByEmail(email);
  const newUser = await userService.getUserByEmail(email);
  if (!newUser || !(await newUser.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return await userService.updateUserLoggedOutState(newUser.id, false);
  // return newUser;
};

/**
 * Update the isLoggedOut state
 * @param {boolean} isLoggedOut
 * @param {string} userId
 * @returns {Promise<User>}
 */

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken, userId) => {
  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }

  if (user.isLoggedOut) {
    return { message: "User already logged out" };
  }

  // return {message: "Logout successful"};

  const tokenDetails = await tokenService.verifyToken(
    refreshToken,
    tokenTypes.REFRESH
  );

  if (!tokenDetails) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Token");
  }

  if (!(user.id.toString() === tokenDetails.user.toString())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Request");
  }

  await userService.updateUserLoggedOutState(tokenDetails.user, true);
  await tokenService.deleteToken(tokenDetails.id);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  // console.log("REFRESH TOKEN", refreshToken);
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );

    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate oo");
    }

    // console.log("REFRESH TOKEN DOC", refreshTokenDoc);

    const newUser = await userService.getUserById(refreshTokenDoc.user);

    // console.log("NEW USER", newUser);

    if (!newUser) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate ii");
    }

    if (newUser.isLoggedOut) {
      //! checks if the user is logged out by checking the isLoggedOut state, if so then they cannot generate any more token.
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, "User already logged out");
    }

    await tokenService.deleteToken(refreshTokenDoc.id);

    // console.log("GENERATING NEW TOKENS");
    return tokenService.generateAuthTokens(newUser);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate 55");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const newUser = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!newUser) {
      throw new Error();
    }
    const hashPassword = await bcrypt.hash(newPassword, 8);
    await userService.updateUserById(newUser.id, {
      password: hashPassword,
    });
    await Token.deleteMany({
      user: newUser.id,
      type: tokenTypes.RESET_PASSWORD,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const newUser = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!newUser) {
      throw new Error();
    }
    await Token.deleteMany({ user: newUser.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(newUser.id, {
      isEmailVerified: true,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
