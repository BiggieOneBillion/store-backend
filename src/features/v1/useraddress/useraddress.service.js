const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const UserAddress = require("./useraddress.model");
const catchAsync = require("../../../utils/catchAsync");
const User = require("../user/user.model");
const { get } = require("http");

const addToUserAddress = async (userAddressBody) => {
  return UserAddress.create({
    user: userAddressBody.user,
    address: {
      street: userAddressBody.street,
      city: userAddressBody.city,
      state: userAddressBody.state,
      zipCode: userAddressBody.zipCode,
      country: userAddressBody.country,
    },
  });
};

const getUserAddress = async (userId) => {
  // check if user exist
  const user = await User.findById(userId);
  // if user does not exist, throw an error
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const addresses = await UserAddress.find({ user: userId });

  if (!addresses) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // if (addresses.length === 0) {
  //   throw new ApiError(
  //     httpStatus.NOT_FOUND,
  //     "No addresses found for this user"
  //   );
  // }

  return addresses;
};

const removeFromUserAddress = async (userId, addressId) => {
  // check if user exist
  const user = await User.findById(userId);
  // if user does not exist, throw an error
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const address = await UserAddress.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, "Address not found");
  }

  return address;
};

const clearUserAddress = async (userId) => {
  // check if user exist
  const user = await User.findById(userId);
  // if user does not exist, throw an error
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const addresses = await UserAddress.deleteMany({ user: userId });

  if (addresses.deletedCount === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No addresses found for this user"
    );
  }

  return { message: "All addresses cleared successfully" };
};

const updateUserAddress = async (userId, addressId, updateBody) => {
  // check if user exist
  const user = await User.findById(userId);
  // if user does not exist, throw an error
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const address = await UserAddress.findOneAndUpdate(
    { _id: addressId, user: userId },
    {
      $set: {
        "address.street": updateBody.street,
        "address.city": updateBody.city,
        "address.state": updateBody.state,
        "address.zipCode": updateBody.zipCode,
        "address.country": updateBody.country,
      },
    },
    { new: true }
  );


  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, "Address not found");
  }

  return address;
};

module.exports = {
  addToUserAddress,
  getUserAddress,
  removeFromUserAddress,
  clearUserAddress,
  updateUserAddress,
};
