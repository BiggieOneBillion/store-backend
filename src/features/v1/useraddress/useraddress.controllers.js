const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const { userAddressService } = require("./index");

const addToUserAddress = catchAsync(async (req, res, next) => {
  const userAddress = await userAddressService.addToUserAddress({
    ...req.body,
    user: req.params.userId,
  });
  res.status(httpStatus.CREATED).send(userAddress);
});

const getUserAddress = catchAsync(async (req, res, next) => {
  const userAddress = await userAddressService.getUserAddress(
    req.params.userId
  );
  res.send(userAddress);
});

const removeFromUserAddress = catchAsync(async (req, res, next) => {
  const userAddress = await userAddressService.removeFromUserAddress(
    req.params.userId,
    req.params.addressId
  );
  res.send(userAddress);
});

const clearUserAddress = catchAsync(async (req, res, next) => {
  await userAddressService.clearUserAddress(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateUserAddress = catchAsync(async (req, res, next) => {
  const userAddress = await userAddressService.updateUserAddress(
    req.params.userId,
    req.params.addressId,
    req.body
  );
  res.send(userAddress);
});

const getAllUserAddresses = catchAsync(async (req, res, next) => {
  const filter = pick(req.query, ["user", "city", "state"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userAddressService.queryUserAddresses(filter, options);
  res.send(result);
});

module.exports = {
  addToUserAddress,
  getUserAddress,
  removeFromUserAddress,
  clearUserAddress,
  updateUserAddress,
  getAllUserAddresses, //! NO CONTROLLER FOR THIS YET
};
