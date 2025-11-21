const mongoose = require("mongoose");
const { toJSON } = require("../../../utils/plugins");
const { otpTypes } = require("../../../config/otp");

const otpSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [otpTypes.ACCESS],
      required: true,
      default: otpTypes.ACCESS,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
otpSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
