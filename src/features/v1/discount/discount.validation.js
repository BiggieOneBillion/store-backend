const Joi = require("joi");
const { objectId } = require("../../../../src/validations/custom.validation");

const discountValidation = {
  createDiscount: {
    body: Joi.object().keys({
      code: Joi.string(),
      type: Joi.string().required().valid("percentage", "fixed"),
      value: Joi.number()
        .required()
        .when("type", {
          is: "percentage",
          then: Joi.number().min(0).max(100),
        }),
      startDate: Joi.date().required(),
      endDate: Joi.date().required().min(Joi.ref("startDate")),
      minimumPurchase: Joi.number().min(0),
      maximumDiscount: Joi.number().min(0),
      usageLimit: Joi.object({
        perCustomer: Joi.number().integer().min(1),
        total: Joi.number().integer().min(1),
      }),
      applicableTo: Joi.string().valid("all", "category", "product", "variant"),
      conditions: Joi.object({
        categories: Joi.array().items(Joi.string()),
        products: Joi.array().items(Joi.string().custom(objectId)),
        excludedProducts: Joi.array().items(Joi.string().custom(objectId)),
      }),
      active: Joi.boolean(),
    }),
  },

  getDiscounts: {
    query: Joi.object().keys({
      code: Joi.string(),
      type: Joi.string(),
      active: Joi.boolean(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  },

  updateDiscount: {
    params: Joi.object().keys({
      discountId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
      type: Joi.string().valid("percentage", "fixed"),
      value: Joi.number(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      minimumPurchase: Joi.number().min(0),
      maximumDiscount: Joi.number().min(0),
      usageLimit: Joi.object({
        perCustomer: Joi.number().integer().min(1),
        total: Joi.number().integer().min(1),
      }),
      active: Joi.boolean(),
      applicableTo: Joi.string().valid("all", "category", "product", "variant"),
      conditions: Joi.object({
        categories: Joi.array().items(Joi.string()),
        products: Joi.array().items(Joi.string().custom(objectId)),
        excludedProducts: Joi.array().items(Joi.string().custom(objectId)),
      }),
    }),
  },

  deleteDiscount: {
    params: Joi.object().keys({
      discountId: Joi.string().custom(objectId).required(),
    }),
  },

  applyProductDiscount: {
    params: Joi.object().keys({
      productId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
      type: Joi.string().required().valid("percentage", "fixed"),
      value: Joi.number().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required().min(Joi.ref("startDate")),
    }),
  },

  applyVariantDiscount: {
    params: Joi.object().keys({
      productId: Joi.string().custom(objectId).required(),
      variantId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
      type: Joi.string().required().valid("percentage", "fixed"),
      value: Joi.number().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required().min(Joi.ref("startDate")),
    }),
  },

  applyCategoryDiscount: {
    params: Joi.object().keys({
      category: Joi.string().required(),
    }),
    body: Joi.object().keys({
      type: Joi.string().required().valid("percentage", "fixed"),
      value: Joi.number().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required().min(Joi.ref("startDate")),
    }),
  },

  validateDiscount: {
    body: Joi.object().keys({
      code: Joi.string().required(),
      cartTotal: Joi.number().required().min(0),
    }),
  },

  getDiscountByCode: {
    params: Joi.object().keys({
      code: Joi.string().required(),
    }),
  },
  updateDiscountStatus: {
      params: Joi.object().keys({
        discountId: Joi.string().custom(objectId).required()
      }),
      body: Joi.object().keys({
        active: Joi.boolean().required()
      })
    },
};

module.exports = discountValidation;
