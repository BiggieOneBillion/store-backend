const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

// Payment Validation Schemas
const createPayment = {
  body: Joi.object().keys({
    amount: Joi.number().required().min(0),
    currency: Joi.string().required(),
    paymentMethod: Joi.string()
      .required()
      .valid("credit_card", "debit_card", "bank_transfer", "wallet", "paypal"),
    paymentGateway: Joi.string().required(),
    gatewayTransactionId: Joi.string().required(),
  }),
};

const getPayments = {
  query: Joi.object().keys({
    status: Joi.string().valid(
      "pending",
      "processing",
      "completed",
      "failed",
      "refunded"
    ),
    paymentMethod: Joi.string(),
    paymentGateway: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

const updatePayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid(
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded"
      ),
      refundStatus: Joi.string().valid("none", "partial", "full"),
      refundAmount: Joi.number().min(0),
    })
    .min(1),
};

const deletePayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
};
