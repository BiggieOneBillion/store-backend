const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../../../config/config");
const userService = require("../user/user.service");
const Token = require("./otp-token.model");
const ApiError = require("../../../utils/ApiError");
const { tokenTypes } = require("../../../config/tokens");

const crypto = require("crypto");

function generateSecureOTP() {
  // Generate a random integer between 0 and 999999
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString(); // ensures it’s always 6 digits
}

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateOtpToken = () => {
  return generateSecureOTP();
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {Promise<Token>}
 */
const saveOtpToken = async (token, userId, expires, type) => {
  const otpTokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
  });
  return otpTokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @param {string} userId
 * @returns {Promise<Token>}
 */
const verifyOtpToken = async (token, type, userId) => {
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: userId,
  });

  // If no document exist.
  if (!tokenDoc) {
    console.log("NO TOKEN DOC");
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  console.log("TOKEN DOC", tokenDoc);
  // If token has expired.
  if (moment().isAfter(tokenDoc.expires)) {
    console.log("TOKEN EXPIRED");
    throw new ApiError(httpStatus.BAD_REQUEST, "Token expired");
  }

  return tokenDoc;
};

module.exports = {
  generateOtpToken,
  saveOtpToken,
  verifyOtpToken,
};
