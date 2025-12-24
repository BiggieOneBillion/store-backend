const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

const addToUserAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zipCode: Joi.string().required(),
  }),
};

const updateUserAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    addressId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    zipCode: Joi.string().optional(),
  }),
};

const getUserAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const removeFromUserAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    addressId: Joi.string().custom(objectId).required(),
  }),
};

const clearUserAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  addToUserAddress,
  getUserAddress,
  removeFromUserAddress,
  clearUserAddress,
  updateUserAddress,
};
