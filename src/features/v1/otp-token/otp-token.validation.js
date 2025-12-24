const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

// Payment Validation Schemas
const verifyToken = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  verifyToken,
};
