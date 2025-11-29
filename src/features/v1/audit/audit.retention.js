const AuditLog = require('./audit.model');
const logger = require('../../../config/logger');

/**
 * Retention policy configuration
 */
const RETENTION_DAYS = {
  SECURITY: 365,      // 1 year
  FINANCIAL: 2555,    // 7 years (compliance)
  INVENTORY: 180,     // 6 months
  USER_ACTIVITY: 90,  // 3 months
  ADMIN: 730,         // 2 years
  SYSTEM: 30          // 1 month
};

/**
 * Archive old audit logs based on retention policy
 * @param {string} category - Audit category
 * @returns {Promise<Object>}
 */
const archiveOldLogs = async (category = null) => {
  try {
    const results = {};
    const categories = category ? [category] : Object.keys(RETENTION_DAYS);
    
    for (const cat of categories) {
      const retentionDays = RETENTION_DAYS[cat];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      // Find logs older than retention period
      const oldLogs = await AuditLog.find({
        category: cat,
        timestamp: { $lt: cutoffDate }
      });
      
      if (oldLogs.length > 0) {
        // In production, you might want to:
        // 1. Export to archive storage (S3, etc.)
        // 2. Compress the data
        // 3. Then delete from main database
        
        // For now, we'll just delete them
        const deleteResult = await AuditLog.deleteMany({
          category: cat,
          timestamp: { $lt: cutoffDate }
        });
        
        results[cat] = {
          archived: deleteResult.deletedCount,
          cutoffDate: cutoffDate
        };
        
        logger.info(`Archived ${deleteResult.deletedCount} ${cat} logs older than ${cutoffDate}`);
      } else {
        results[cat] = {
          archived: 0,
          cutoffDate: cutoffDate
        };
      }
    }
    
    return results;
  } catch (error) {
    logger.error('Failed to archive old logs:', error);
    throw error;
  }
};

/**
 * Get retention policy information
 * @returns {Object}
 */
const getRetentionPolicy = () => {
  return RETENTION_DAYS;
};

/**
 * Update retention policy for a category
 * @param {string} category
 * @param {number} days
 * @returns {Object}
 */
const updateRetentionPolicy = (category, days) => {
  if (!RETENTION_DAYS.hasOwnProperty(category)) {
    throw new Error(`Invalid category: ${category}`);
  }
  
  if (days < 1) {
    throw new Error('Retention days must be at least 1');
  }
  
  RETENTION_DAYS[category] = days;
  logger.info(`Updated retention policy for ${category} to ${days} days`);
  
  return RETENTION_DAYS;
};

/**
 * Get statistics about logs to be archived
 * @returns {Promise<Object>}
 */
const getArchiveStats = async () => {
  const stats = {};
  
  for (const [category, retentionDays] of Object.entries(RETENTION_DAYS)) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const count = await AuditLog.countDocuments({
      category,
      timestamp: { $lt: cutoffDate }
    });
    
    stats[category] = {
      logsToArchive: count,
      cutoffDate: cutoffDate,
      retentionDays: retentionDays
    };
  }
  
  return stats;
};

/**
 * Delete all logs (use with caution!)
 * @param {string} category - Optional category filter
 * @returns {Promise<Object>}
 */
const deleteAllLogs = async (category = null) => {
  const filter = category ? { category } : {};
  const result = await AuditLog.deleteMany(filter);
  
  logger.warn(`Deleted ${result.deletedCount} audit logs${category ? ` in category ${category}` : ''}`);
  
  return {
    deleted: result.deletedCount,
    category: category || 'all'
  };
};

module.exports = {
  archiveOldLogs,
  getRetentionPolicy,
  updateRetentionPolicy,
  getArchiveStats,
  deleteAllLogs,
  RETENTION_DAYS
};
