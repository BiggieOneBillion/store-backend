const AuditLog = require('./audit.model');
const logger = require('../../../config/logger');

/**
 * Create an audit log entry
 * @param {Object} auditData
 * @returns {Promise<AuditLog>}
 */
const createAuditLog = async (auditData) => {
  try {
    const auditLog = await AuditLog.create(auditData);
    return auditLog;
  } catch (error) {
    // Don't let audit logging break the main operation
    logger.error('Failed to create audit log:', error);
    return null;
  }
};

/**
 * Log user action
 * @param {Object} params
 * @returns {Promise<AuditLog>}
 */
const logUserAction = async ({
  user,
  action,
  entityType,
  entityId,
  changes,
  metadata,
  category,
  severity = 'INFO',
  status = 'SUCCESS',
  description
}) => {
  return createAuditLog({
    user: user._id || user.id,
    userEmail: user.email,
    userRole: user.role,
    action,
    entityType,
    entityId,
    changes,
    metadata,
    category,
    severity,
    status,
    description,
    timestamp: new Date()
  });
};

/**
 * Log authentication event
 * @param {Object} params
 * @returns {Promise<AuditLog>}
 */
const logAuthEvent = async ({
  user,
  action,
  status,
  metadata,
  errorMessage
}) => {
  return createAuditLog({
    user: user?._id || user?.id,
    userEmail: user?.email,
    userRole: user?.role,
    action,
    entityType: 'Auth',
    category: 'SECURITY',
    severity: status === 'FAILURE' ? 'WARNING' : 'INFO',
    status,
    metadata,
    errorMessage,
    timestamp: new Date()
  });
};

/**
 * Log payment event
 * @param {Object} params
 * @returns {Promise<AuditLog>}
 */
const logPaymentEvent = async ({
  user,
  action,
  orderId,
  amount,
  status,
  metadata
}) => {
  return createAuditLog({
    user: user._id || user.id,
    userEmail: user.email,
    userRole: user.role,
    action,
    entityType: 'Payment',
    entityId: orderId,
    category: 'FINANCIAL',
    severity: status === 'FAILURE' ? 'ERROR' : 'INFO',
    status,
    metadata: {
      ...metadata,
      amount
    },
    timestamp: new Date()
  });
};

/**
 * Get audit logs with filters
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getAuditLogs = async (filter, options) => {
  const auditLogs = await AuditLog.paginate(filter, options);
  return auditLogs;
};

/**
 * Get audit trail for specific entity
 * @param {string} entityType
 * @param {string} entityId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getEntityAuditTrail = async (entityType, entityId, options = {}) => {
  const filter = { entityType, entityId };
  const queryOptions = {
    sortBy: 'timestamp:desc',
    limit: options.limit || 50,
    page: options.page || 1,
    populate: 'user'
  };
  
  return getAuditLogs(filter, queryOptions);
};

/**
 * Get user activity trail
 * @param {string} userId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getUserAuditTrail = async (userId, options = {}) => {
  const filter = { user: userId };
  const queryOptions = {
    sortBy: 'timestamp:desc',
    limit: options.limit || 100,
    page: options.page || 1
  };
  
  return getAuditLogs(filter, queryOptions);
};

/**
 * Get audit logs by category (multiple trails)
 * @param {string} category
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getAuditLogsByCategory = async (category, options = {}) => {
  const filter = { category };
  const queryOptions = {
    sortBy: 'timestamp:desc',
    limit: options.limit || 100,
    page: options.page || 1,
    populate: 'user'
  };
  
  return getAuditLogs(filter, queryOptions);
};

/**
 * Get security audit trail
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getSecurityAuditTrail = async (options = {}) => {
  return getAuditLogsByCategory('SECURITY', options);
};

/**
 * Get financial audit trail
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getFinancialAuditTrail = async (options = {}) => {
  return getAuditLogsByCategory('FINANCIAL', options);
};

/**
 * Get inventory audit trail
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getInventoryAuditTrail = async (options = {}) => {
  return getAuditLogsByCategory('INVENTORY', options);
};

/**
 * Search audit logs
 * @param {Object} params
 * @returns {Promise<QueryResult>}
 */
const searchAuditLogs = async ({
  userId,
  action,
  entityType,
  category,
  severity,
  status,
  startDate,
  endDate,
  page = 1,
  limit = 50
}) => {
  const filter = {};
  
  if (userId) filter.user = userId;
  if (action) filter.action = action;
  if (entityType) filter.entityType = entityType;
  if (category) filter.category = category;
  if (severity) filter.severity = severity;
  if (status) filter.status = status;
  
  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
  }
  
  return getAuditLogs(filter, {
    page,
    limit,
    sortBy: 'timestamp:desc',
    populate: 'user'
  });
};

module.exports = {
  createAuditLog,
  logUserAction,
  logAuthEvent,
  logPaymentEvent,
  getAuditLogs,
  getEntityAuditTrail,
  getUserAuditTrail,
  getAuditLogsByCategory,
  getSecurityAuditTrail,
  getFinancialAuditTrail,
  getInventoryAuditTrail,
  searchAuditLogs
};
