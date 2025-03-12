const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

// Store Validation Schemas
const createStore = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    logo: Joi.any().meta({ swaggerType: "file" }),
    bannerImage: Joi.any().meta({ swaggerType: "file" }),
    categories: Joi.array().items(Joi.string()),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string(),
    address: Joi.object().keys({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zipCode: Joi.string().required(),
    }),
  }),
};

const getStores = {
  query: Joi.object().keys({
    name: Joi.string(),
    owner: Joi.string().custom(objectId),
    status: Joi.string().valid("active", "inactive", "suspended"),
    categories: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getStore = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateStore = {
  params: Joi.object().keys({
    storeId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      // logo: Joi.any().meta({ swaggerType: "file" }).required(),
      bannerImage: Joi.string(),
      status: Joi.string().valid("active", "inactive", "suspended"),
      categories: Joi.array().items(Joi.string()),
      contactEmail: Joi.string().email(),
      contactPhone: Joi.number(),
      address: Joi.object().keys({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        zipCode: Joi.number(),
      }),
    })
    .min(1),
};

const deleteStore = {
  params: Joi.object().keys({
    storeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getStores,
  getStore,
  updateStore,
  deleteStore,
  createStore,
};
