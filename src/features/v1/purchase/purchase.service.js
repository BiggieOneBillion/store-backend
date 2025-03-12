const httpStatus = require("http-status");
const Purchase = require("./purchase.model");
const ApiError = require("../../../utils/ApiError");
const {
  payment: {
    paymentService: { getPaymentById },
  },
  order: {
    orderService: { getOrderById },
  },
} = require("../index");

// Purchase Service
const createPurchase = async (purchaseBody) => {
  // Verify order and payment exist
  const order = await getOrderById(purchaseBody.order);
  const payment = await getPaymentById(purchaseBody.payment);
  if (!order || !payment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order or payment not found");
  }
  return Purchase.create(purchaseBody);
};

const queryPurchases = async (filter, options) => {
  const purchases = await Purchase.paginate(filter, options);
  return purchases;
};

const getPurchaseById = async (id) => {
  return Purchase.findById(id);
};

const updatePurchaseById = async (purchaseId, updateBody) => {
  const purchase = await getPurchaseById(purchaseId);
  if (!purchase) {
    throw new ApiError(httpStatus.NOT_FOUND, "Purchase not found");
  }
  Object.assign(purchase, updateBody);
  await purchase.save();
  return purchase;
};

const deletePurchaseById = async (purchaseId) => {
  const purchase = await getPurchaseById(purchaseId);
  if (!purchase) {
    throw new ApiError(httpStatus.NOT_FOUND, "Purchase not found");
  }
  await purchase.remove();
  return purchase;
};

module.exports = {
  // Purchase Service
  createPurchase,
  queryPurchases,
  getPurchaseById,
  updatePurchaseById,
  deletePurchaseById,
};
