const cron = require('node-cron');
const retentionService = require('../features/v1/audit/audit.retention');
const alertService = require('../features/v1/audit/audit.alerts');
const logger = require('../config/logger');

/**
 * Schedule audit log archival
 * Runs daily at 2 AM
 */
const scheduleLogArchival = () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('Starting scheduled audit log archival...');
      const result = await retentionService.archiveOldLogs();
      logger.info('Audit log archival completed:', result);
    } catch (error) {
      logger.error('Audit log archival failed:', error);
    }
  });
  
  logger.info('Audit log archival scheduled: Daily at 2 AM');
};

/**
 * Schedule alert checks
 * Runs every 15 minutes
 */
const scheduleAlertChecks = () => {
  cron.schedule('*/15 * * * *', async () => {
    try {
      const alerts = await alertService.runAllAlertChecks();
      if (alerts.length > 0) {
        logger.warn(`Alert check found ${alerts.length} alerts`);
      }
    } catch (error) {
      logger.error('Alert check failed:', error);
    }
  });
  
  logger.info('Alert checks scheduled: Every 15 minutes');
};

/**
 * Initialize all audit cron jobs
 */
const initializeAuditCronJobs = () => {
  scheduleLogArchival();
  scheduleAlertChecks();
  logger.info('Audit cron jobs initialized');
};

module.exports = {
  initializeAuditCronJobs,
  scheduleLogArchival,
  scheduleAlertChecks
};
