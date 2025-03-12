const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
// const {
//   store: { storeModel: Store },
//   user: { userModel: User },
// } = require("../index");
const Store = require("../store/store.model")
const User = require("../user/user.model")

const createStore = async (storeBody) => {
  // Verify user exists and is a seller
  const user = await User.findById(storeBody.owner);
  if (!user || !user.role.includes("seller")) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid user or user is not a seller"
    );
  }
  return Store.create(storeBody);
};

const queryStores = async (filter, options) => {
  const stores = await Store.paginate(filter, options);
  return stores;
};

const getStoreByOwnerId = async (id) => {
  return Store.findOne({ owner: id });
};

const getStoreByStoreId = async (id) => {
  return Store.findById(id);
};

const updateStoreById = async (userId, updateBody) => {
  // console.log("from controller", updateBody);
  const store = await getStoreByOwnerId(userId);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store not found");
  }
  Object.assign(store, updateBody);
  await store.save();
  return store;
};

const deleteStoreById = async (storeId) => {
  const store = await getStoreByStoreId(storeId);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store not found");
  }
  await store.remove();
  return store;
};

module.exports = {
  // Store Service
  createStore,
  queryStores,
  getStoreByOwnerId,
  updateStoreById,
  deleteStoreById,
  getStoreByStoreId,
};
