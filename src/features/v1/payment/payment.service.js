const httpStatus = require("http-status");
const Payment = require("./payment.model");
const ApiError = require("../../../utils/ApiError");

// Payment Service
const createPayment = async (paymentBody) => {
  // Add payment gateway integration logic here
  return Payment.create(paymentBody);
};

const queryPayments = async (filter, options) => {
  const payments = await Payment.paginate(filter, options);
  return payments;
};

const getPaymentById = async (id) => {
  return Payment.findById(id);
};

const updatePaymentById = async (paymentId, updateBody) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  Object.assign(payment, updateBody);
  await payment.save();
  return payment;
};

const deletePaymentById = async (paymentId) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  await payment.remove();
  return payment;
};

module.exports = {
  // Payment Service
  createPayment,
  queryPayments,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
};
