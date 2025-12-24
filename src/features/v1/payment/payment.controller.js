const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const { paymentService } = require("./index");

// Payment Controllers
const createPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.createPayment(req.body);
  res.status(httpStatus.CREATED).send(payment);
});

const getPayments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status", "paymentMethod", "paymentGateway"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await paymentService.queryPayments(filter, options);
  res.send(result);
});

const getPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  res.send(payment);
});

const getAllPayments = catchAsync(async (req, res) => {
  const payments = await paymentService.getAllPayments();
  res.send(payments);
});

const updatePayment = catchAsync(async (req, res) => {
  const payment = await paymentService.updatePaymentById(
    req.params.paymentId,
    req.body
  );
  res.send(payment);
});

const deletePayment = catchAsync(async (req, res) => {
  await paymentService.deletePaymentById(req.params.paymentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
  getAllPayments
};
