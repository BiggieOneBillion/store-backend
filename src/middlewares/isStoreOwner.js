const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { storeService } = require("../features/v1/store/index");

const getStore = () => async (req, res, next) => {
  const store = await storeService.getStoreByOwnerId(req.params.userId);
  if (!store) {
    return next(
      new ApiError(httpStatus.BAD_REQUEST, "User has no store, not a seller")
    );
  }
  req.store = store; // attach the store object to the request object
  return next();
};

module.exports = getStore;
