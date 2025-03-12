const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const { purchaseService } = require("./index");

// Purchase Controllers
const createPurchase = catchAsync(async (req, res) => {
  const purchase = await purchaseService.createPurchase({
    ...req.body,
    buyer: req.user.id,
  });
  res.status(httpStatus.CREATED).send(purchase);
});

const getPurchases = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["buyer", "seller", "store", "status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await purchaseService.queryPurchases(filter, options);
  res.send(result);
});

const getPurchase = catchAsync(async (req, res) => {
  const purchase = await purchaseService.getPurchaseById(req.params.purchaseId);
  if (!purchase) {
    throw new ApiError(httpStatus.NOT_FOUND, "Purchase not found");
  }
  res.send(purchase);
});

const updatePurchase = catchAsync(async (req, res) => {
  const purchase = await purchaseService.updatePurchaseById(
    req.params.purchaseId,
    req.body
  );
  res.send(purchase);
});

const deletePurchase = catchAsync(async (req, res) => {
  await purchaseService.deletePurchaseById(req.params.purchaseId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPurchase,
  getPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase,
};
