const AuditLog = require('./audit.model');
const emailService = require('../email/email.service');
const logger = require('../../../config/logger');

/**
 * Alert rules configuration
 */
const ALERT_RULES = {
  FAILED_LOGIN_THRESHOLD: 5,           // Alert after 5 failed logins
  FAILED_LOGIN_WINDOW_MINUTES: 15,     // Within 15 minutes
  PAYMENT_FAILURE_THRESHOLD: 3,        // Alert after 3 payment failures
  PAYMENT_FAILURE_WINDOW_MINUTES: 60,  // Within 1 hour
  CRITICAL_ERROR_THRESHOLD: 1,         // Alert immediately on critical errors
  SUSPICIOUS_IP_THRESHOLD: 10,         // Alert if 10+ actions from same IP
  SUSPICIOUS_IP_WINDOW_MINUTES: 5      // Within 5 minutes
};

/**
 * Check for failed login attempts
 * @param {string} userId - User ID or email
 * @returns {Promise<Object>}
 */
const checkFailedLogins = async (userId) => {
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - ALERT_RULES.FAILED_LOGIN_WINDOW_MINUTES);
  
  const failedAttempts = await AuditLog.countDocuments({
    action: 'LOGIN_FAILED',
    $or: [
      { user: userId },
      { userEmail: userId }
    ],
    timestamp: { $gte: windowStart }
  });
  
  if (failedAttempts >= ALERT_RULES.FAILED_LOGIN_THRESHOLD) {
    return {
      alert: true,
      type: 'FAILED_LOGIN',
      severity: 'WARNING',
      message: `${failedAttempts} failed login attempts detected for user ${userId} in the last ${ALERT_RULES.FAILED_LOGIN_WINDOW_MINUTES} minutes`,
      count: failedAttempts,
      userId
    };
  }
  
  return { alert: false };
};

/**
 * Check for payment failures
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
const checkPaymentFailures = async (userId) => {
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - ALERT_RULES.PAYMENT_FAILURE_WINDOW_MINUTES);
  
  const failedPayments = await AuditLog.countDocuments({
    user: userId,
    action: 'PAYMENT_FAILED',
    timestamp: { $gte: windowStart }
  });
  
  if (failedPayments >= ALERT_RULES.PAYMENT_FAILURE_THRESHOLD) {
    return {
      alert: true,
      type: 'PAYMENT_FAILURE',
      severity: 'ERROR',
      message: `${failedPayments} payment failures detected for user ${userId} in the last ${ALERT_RULES.PAYMENT_FAILURE_WINDOW_MINUTES} minutes`,
      count: failedPayments,
      userId
    };
  }
  
  return { alert: false };
};

/**
 * Check for suspicious IP activity
 * @param {string} ip - IP address
 * @returns {Promise<Object>}
 */
const checkSuspiciousIP = async (ip) => {
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - ALERT_RULES.SUSPICIOUS_IP_WINDOW_MINUTES);
  
  const actionsFromIP = await AuditLog.countDocuments({
    'metadata.ip': ip,
    timestamp: { $gte: windowStart }
  });
  
  if (actionsFromIP >= ALERT_RULES.SUSPICIOUS_IP_THRESHOLD) {
    return {
      alert: true,
      type: 'SUSPICIOUS_IP',
      severity: 'WARNING',
      message: `${actionsFromIP} actions detected from IP ${ip} in the last ${ALERT_RULES.SUSPICIOUS_IP_WINDOW_MINUTES} minutes`,
      count: actionsFromIP,
      ip
    };
  }
  
  return { alert: false };
};

/**
 * Check for critical errors
 * @returns {Promise<Array>}
 */
const checkCriticalErrors = async () => {
  const recentTime = new Date();
  recentTime.setMinutes(recentTime.getMinutes() - 5); // Last 5 minutes
  
  const criticalErrors = await AuditLog.find({
    severity: 'CRITICAL',
    timestamp: { $gte: recentTime }
  }).populate('user', 'name email');
  
  if (criticalErrors.length > 0) {
    return criticalErrors.map(error => ({
      alert: true,
      type: 'CRITICAL_ERROR',
      severity: 'CRITICAL',
      message: `Critical error detected: ${error.action} - ${error.errorMessage || 'No details'}`,
      error: error
    }));
  }
  
  return [];
};

/**
 * Send alert notification
 * @param {Object} alert - Alert object
 * @param {Array} recipients - Email recipients
 * @returns {Promise<void>}
 */
const sendAlertNotification = async (alert, recipients = []) => {
  try {
    // Default to admin email if no recipients specified
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const emailRecipients = recipients.length > 0 ? recipients : [adminEmail];
    
    const subject = `Security Alert: ${alert.type} - ${alert.severity}`;
    const text = `
Security Alert Detected

Type: ${alert.type}
Severity: ${alert.severity}
Message: ${alert.message}

Timestamp: ${new Date().toISOString()}

Please review the audit logs for more details.
    `;
    
    // In a real implementation, you would send emails to all recipients
    // For now, we'll just log it
    logger.warn(`SECURITY ALERT: ${alert.message}`, {
      type: alert.type,
      severity: alert.severity,
      recipients: emailRecipients
    });
    
    // Uncomment to actually send emails:
    // for (const recipient of emailRecipients) {
    //   await emailService.sendEmail(recipient, subject, text);
    // }
    
  } catch (error) {
    logger.error('Failed to send alert notification:', error);
  }
};

/**
 * Run all alert checks
 * @returns {Promise<Array>}
 */
const runAllAlertChecks = async () => {
  const alerts = [];
  
  try {
    // Check for critical errors
    const criticalAlerts = await checkCriticalErrors();
    alerts.push(...criticalAlerts);
    
    // Get recent activity to check
    const recentTime = new Date();
    recentTime.setMinutes(recentTime.getMinutes() - 15);
    
    const recentLogs = await AuditLog.find({
      timestamp: { $gte: recentTime }
    }).select('user userEmail metadata.ip');
    
    // Check unique users and IPs
    const uniqueUsers = [...new Set(recentLogs.map(log => log.user?.toString()).filter(Boolean))];
    const uniqueIPs = [...new Set(recentLogs.map(log => log.metadata?.ip).filter(Boolean))];
    
    // Check failed logins for each user
    for (const userId of uniqueUsers) {
      const loginAlert = await checkFailedLogins(userId);
      if (loginAlert.alert) {
        alerts.push(loginAlert);
      }
      
      const paymentAlert = await checkPaymentFailures(userId);
      if (paymentAlert.alert) {
        alerts.push(paymentAlert);
      }
    }
    
    // Check suspicious IPs
    for (const ip of uniqueIPs) {
      const ipAlert = await checkSuspiciousIP(ip);
      if (ipAlert.alert) {
        alerts.push(ipAlert);
      }
    }
    
    // Send notifications for all alerts
    for (const alert of alerts) {
      await sendAlertNotification(alert);
    }
    
    return alerts;
  } catch (error) {
    logger.error('Failed to run alert checks:', error);
    return [];
  }
};

/**
 * Get alert configuration
 * @returns {Object}
 */
const getAlertConfiguration = () => {
  return ALERT_RULES;
};

/**
 * Update alert configuration
 * @param {Object} updates - Configuration updates
 * @returns {Object}
 */
const updateAlertConfiguration = (updates) => {
  Object.assign(ALERT_RULES, updates);
  logger.info('Alert configuration updated:', updates);
  return ALERT_RULES;
};

module.exports = {
  checkFailedLogins,
  checkPaymentFailures,
  checkSuspiciousIP,
  checkCriticalErrors,
  sendAlertNotification,
  runAllAlertChecks,
  getAlertConfiguration,
  updateAlertConfiguration,
  ALERT_RULES
};
