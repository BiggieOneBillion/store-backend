const Joi = require('joi');
const { objectId } = require("../../../validations/custom.validation");

const stockHistoryValidation = {
  createStockEntry: {
    body: Joi.object().keys({
      product: Joi.string().custom(objectId).required(),
      type: Joi.string().valid('sale', 'restock', 'refund', 'adjustment', 'return').required(),
      quantity: Joi.number().required(),
      previousStock: Joi.number().required(),
      newStock: Joi.number().required(),
      reference: Joi.string().required(),
      referenceType: Joi.string().valid('order', 'manual', 'return', 'adjustment').required(),
      referenceId: Joi.string().custom(objectId).allow(null),
      notes: Joi.string().allow(null, ''),
      performedBy: Joi.string().custom(objectId).required()
    })
  },

  getStockHistory: {
    query: Joi.object().keys({
      product: Joi.string().custom(objectId),
      type: Joi.string().valid('sale', 'restock', 'refund', 'adjustment', 'return'),
      referenceType: Joi.string().valid('order', 'manual', 'return', 'adjustment'),
      startDate: Joi.date(),
      endDate: Joi.date(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    })
  },

  getProductStockHistory: {
    params: Joi.object().keys({
      productId: Joi.string().custom(objectId).required()
    })
  }
};

module.exports = stockHistoryValidation;