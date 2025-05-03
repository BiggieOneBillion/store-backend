const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    tag: Joi.string().required(),
    price: Joi.number().required().min(0),
    compareAtPrice: Joi.number().min(0),
    images: Joi.array().items(Joi.any().meta({ swaggerType: "file" })),
    inventory: Joi.object().keys({
      quantity: Joi.number().integer().required().min(0),
      sku: Joi.string().required(),
      lowStockThreshold: Joi.number().integer(),
    }),
    variants: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        options: Joi.array().items(Joi.string()),
        price: Joi.number().min(0),
        quantity: Joi.number().integer().min(0),
        sku: Joi.string(),
      })
    ),
    specifications: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.string(),
    store: Joi.string().custom(objectId),
    status: Joi.string().valid("active", "inactive", "out_of_stock"),
    price: Joi.object().keys({
      min: Joi.number(),
      max: Joi.number(),
    }),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const getAllProducts = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      category: Joi.string(),
      price: Joi.number().min(0),
      tag: Joi.string(),
      compareAtPrice: Joi.number().min(0),
      images: Joi.array().items(Joi.string()),
      inventory: Joi.object().keys({
        quantity: Joi.number().integer().min(0),
        sku: Joi.string(),
        lowStockThreshold: Joi.number().integer(),
      }),
      variants: Joi.array().items(
        Joi.object().keys({
          name: Joi.string(),
          options: Joi.array().items(Joi.string()),
          price: Joi.number().min(0),
          quantity: Joi.number().integer().min(0),
          sku: Joi.string(),
        })
      ),
      specifications: Joi.array().items(
        Joi.object().keys({
          name: Joi.string(),
          value: Joi.string(),
        })
      ),
      status: Joi.string().valid("active", "inactive", "out_of_stock"),
    })
    .min(1),
};

const productParams = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getAllProducts,
  productParams,
};
