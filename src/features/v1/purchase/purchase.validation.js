const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

// Purchase Validation Schemas
const createPurchase = {
    body: Joi.object().keys({
      seller: Joi.string().custom(objectId).required(),
      store: Joi.string().custom(objectId).required(),
      order: Joi.string().custom(objectId).required(),
      payment: Joi.string().custom(objectId).required(),
      totalAmount: Joi.number().required().min(0),
      commission: Joi.number().required().min(0),
      sellerPayout: Joi.number().required().min(0)
    })
  };
  
  const getPurchases = {
    query: Joi.object().keys({
      buyer: Joi.string().custom(objectId),
      seller: Joi.string().custom(objectId),
      store: Joi.string().custom(objectId),
      status: Joi.string().valid('pending', 'completed', 'disputed', 'refunded'),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    })
  };
  
  const getPurchase = {
    params: Joi.object().keys({
      purchaseId: Joi.string().custom(objectId)
    })
  };
  
  const updatePurchase = {
    params: Joi.object().keys({
      purchaseId: Joi.string().custom(objectId)
    }),
    body: Joi.object().keys({
      status: Joi.string().valid('pending', 'completed', 'disputed', 'refunded'),
      disputeDetails: Joi.object().keys({
        isDisputed: Joi.boolean(),
        reason: Joi.string(),
        status: Joi.string().valid('open', 'under_review', 'resolved', 'closed')
      })
    }).min(1)
  };
  
  const deletePurchase = {
    params: Joi.object().keys({
      purchaseId: Joi.string().custom(objectId)
    })
  };


  module.exports = {
    createPurchase,
    getPurchases,
    getPurchase,
    updatePurchase,
    deletePurchase
  }