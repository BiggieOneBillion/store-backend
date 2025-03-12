const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

// Order Validation Schemas
const createOrder = {
  body: Joi.object().keys({
    buyer: Joi.string().custom(objectId).required(),
    items: Joi.array()
      .items(
        Joi.object().keys({
          product: Joi.string().custom(objectId).required(),
          store: Joi.string().custom(objectId).required(),
          quantity: Joi.number().integer().required().min(1),
          variant: Joi.object().keys({
            name: Joi.string(),
            option: Joi.string(),
          }),
        })
      )
      .required(),
    shippingAddress: Joi.object()
      .keys({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        zipCode: Joi.string().required(),
      })
      .required(),
    // subtotal: Joi.number().required().min(0),
    // shippingCost: Joi.number().required().min(0),
    // tax: Joi.number().required().min(0),
    // total: Joi.number().required().min(0)
  }),
};

const getOrders = {
  query: Joi.object().keys({
    buyer: Joi.string().custom(objectId),
    status: Joi.string().valid(
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ),
    store: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    storeId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ),
      shippingAddress: Joi.object().keys({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        zipCode: Joi.string(),
      }),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
