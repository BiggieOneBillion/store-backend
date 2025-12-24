const Joi = require('joi');
const { objectId } = require('../../../validations/custom.validation');

const getAuditLogs = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    action: Joi.string(),
    entityType: Joi.string(),
    category: Joi.string().valid('SECURITY', 'FINANCIAL', 'INVENTORY', 'USER_ACTIVITY', 'ADMIN', 'SYSTEM'),
    severity: Joi.string().valid('INFO', 'WARNING', 'ERROR', 'CRITICAL'),
    status: Joi.string().valid('SUCCESS', 'FAILURE', 'PENDING'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string()
  })
};

const getEntityAuditTrail = {
  params: Joi.object().keys({
    entityType: Joi.string().required(),
    entityId: Joi.string().custom(objectId).required()
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getByCategory = {
  params: Joi.object().keys({
    category: Joi.string().required().valid('security', 'financial', 'inventory', 'user_activity', 'admin', 'system')
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const searchAuditLogs = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    action: Joi.string(),
    entityType: Joi.string(),
    category: Joi.string().valid('SECURITY', 'FINANCIAL', 'INVENTORY', 'USER_ACTIVITY', 'ADMIN', 'SYSTEM'),
    severity: Joi.string().valid('INFO', 'WARNING', 'ERROR', 'CRITICAL'),
    status: Joi.string().valid('SUCCESS', 'FAILURE', 'PENDING'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    page: Joi.number().integer(),
    limit: Joi.number().integer()
  })
};

module.exports = {
  getAuditLogs,
  getEntityAuditTrail,
  getByCategory,
  searchAuditLogs
};
