const mongoose = require("mongoose");

const userAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipCode: { type: String },
      },
      default: undefined, // Address field is optional
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userAddressSchema.index({ user: 1 });

const UserAddress = mongoose.model("UserAddress", userAddressSchema);

module.exports = UserAddress;
