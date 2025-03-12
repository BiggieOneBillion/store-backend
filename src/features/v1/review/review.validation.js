const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

// Review Validation Schemas
const createReview = {
  body: Joi.object().keys({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string(),
    images: Joi.array().items(Joi.string()),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    product: Joi.string().custom(objectId),
    store: Joi.string().custom(objectId),
    rating: Joi.number().min(1).max(5),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      rating: Joi.number().min(1).max(5),
      comment: Joi.string(),
      images: Joi.array().items(Joi.string()),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReview,
  deleteReview,
  updateReview,
  getReview,
  getReviews,
};
