const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

const addToWishlist = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    storeId: Joi.string().custom(objectId).required()
  })
};

const getWishlists = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    store: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getWishlist = {
  params: Joi.object().keys({
    wishlistId: Joi.string().custom(objectId)
  })
};

const removeFromWishlist = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    storeId: Joi.string().custom(objectId).required()
  })
};

const clearWishlist = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required()
  })
};

module.exports = {
  addToWishlist,
  getWishlists,
  getWishlist,
  removeFromWishlist,
  clearWishlist
};