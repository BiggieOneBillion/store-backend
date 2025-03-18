const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const { orderService } = require("../order/index");
const { storeService } = require("../store/index");

// Order Controllers
const createOrder = catchAsync(async (req, res) => {
  const newOrder = await orderService.createOrder({
    ...req.body,
    buyer: req.user.id,
  });
  res.status(httpStatus.CREATED).send(newOrder);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["buyer", "status", "store"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

const getAllOrder = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrder();
  res.send(result);
})

// get all orders that belong to store
const getAllOrdersByStore = catchAsync(async (req, res) => {
  // check if user has store
  const singleStore = await storeService.getStoreByOwnerId(req.user.id);
  if (!singleStore) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store not found");
  }
  // check if user store is the same as the store in the order
  if (singleStore._id.toString() !== req.params.storeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Store not found");
  }
  // now get all orders under the store
  const orders = await orderService.getAllOrdersByStore(req.params.storeId);
  res.send(orders);
});

const getOrder = catchAsync(async (req, res) => {

  const singleOrder = await orderService.getOrderById(req.params.orderId);
  if (!singleOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  res.send(singleOrder);
});

const getUserOrderList = catchAsync(async (req, res) => {
  // console.log("-------------request-------------", req.user._id)
  const getUserOrders = await orderService.getUserOrder(req.user._id);
  if (!getUserOrders) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  res.send(getUserOrders);
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(
    req.params.orderId,
    req.body,
    req.user.id
  );
  res.send(order);
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getAllOrdersByStore,
  getUserOrderList,
  getAllOrder
};
