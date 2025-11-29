const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const auditService = require('./audit.service');
const retentionService = require('./audit.retention');
const exportService = require('./audit.export');
const alertService = require('./audit.alerts');
const pick = require('../../../utils/pick');

/**
 * Get all audit logs (admin only)
 */
const getAuditLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'action', 'entityType', 'category', 'severity', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  
  // Add date range filter if provided
  if (req.query.startDate || req.query.endDate) {
    filter.timestamp = {};
    if (req.query.startDate) filter.timestamp.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.timestamp.$lte = new Date(req.query.endDate);
  }
  
  const result = await auditService.getAuditLogs(filter, options);
  res.send(result);
});

/**
 * Get audit trail for specific entity
 */
const getEntityAuditTrail = catchAsync(async (req, res) => {
  const { entityType, entityId } = req.params;
  const options = pick(req.query, ['limit', 'page']);
  
  const result = await auditService.getEntityAuditTrail(entityType, entityId, options);
  res.send(result);
});

/**
 * Get user's own audit trail
 */
const getMyAuditTrail = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page']);
  const result = await auditService.getUserAuditTrail(req.user.id, options);
  res.send(result);
});

/**
 * Get audit logs by category
 */
const getAuditLogsByCategory = catchAsync(async (req, res) => {
  const { category } = req.params;
  const options = pick(req.query, ['limit', 'page']);
  
  const result = await auditService.getAuditLogsByCategory(category.toUpperCase(), options);
  res.send(result);
});

/**
 * Get security audit trail
 */
const getSecurityAuditTrail = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page']);
  const result = await auditService.getSecurityAuditTrail(options);
  res.send(result);
});

/**
 * Get financial audit trail
 */
const getFinancialAuditTrail = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page']);
  const result = await auditService.getFinancialAuditTrail(options);
  res.send(result);
});

/**
 * Get inventory audit trail
 */
const getInventoryAuditTrail = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page']);
  const result = await auditService.getInventoryAuditTrail(options);
  res.send(result);
});

/**
 * Search audit logs
 */
const searchAuditLogs = catchAsync(async (req, res) => {
  const searchParams = pick(req.query, [
    'userId', 'action', 'entityType', 'category', 
    'severity', 'status', 'startDate', 'endDate', 
    'page', 'limit'
  ]);
  
  const result = await auditService.searchAuditLogs(searchParams);
  res.send(result);
});

/**
 * Export audit logs to CSV
 */
const exportToCSV = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'action', 'entityType', 'category', 'severity', 'status']);
  
  if (req.query.startDate || req.query.endDate) {
    filter.timestamp = {};
    if (req.query.startDate) filter.timestamp.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.timestamp.$lte = new Date(req.query.endDate);
  }
  
  const csv = await exportService.exportToCSV(filter, { limit: req.query.limit });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
  res.send(csv);
});

/**
 * Export audit logs to PDF
 */
const exportToPDF = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'action', 'entityType', 'category', 'severity', 'status']);
  
  if (req.query.startDate || req.query.endDate) {
    filter.timestamp = {};
    if (req.query.startDate) filter.timestamp.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.timestamp.$lte = new Date(req.query.endDate);
  }
  
  const pdfBuffer = await exportService.exportToPDF(filter, { limit: req.query.limit });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.pdf`);
  res.send(pdfBuffer);
});

/**
 * Get export statistics
 */
const getExportStats = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'action', 'entityType', 'category', 'severity', 'status']);
  const stats = await exportService.getExportStats(filter);
  res.send(stats);
});

/**
 * Archive old logs
 */
const archiveOldLogs = catchAsync(async (req, res) => {
  const { category } = req.query;
  const result = await retentionService.archiveOldLogs(category);
  res.send(result);
});

/**
 * Get retention policy
 */
const getRetentionPolicy = catchAsync(async (req, res) => {
  const policy = retentionService.getRetentionPolicy();
  res.send(policy);
});

/**
 * Get archive statistics
 */
const getArchiveStats = catchAsync(async (req, res) => {
  const stats = await retentionService.getArchiveStats();
  res.send(stats);
});

/**
 * Run alert checks
 */
const runAlertChecks = catchAsync(async (req, res) => {
  const alerts = await alertService.runAllAlertChecks();
  res.send({
    alertsFound: alerts.length,
    alerts
  });
});

/**
 * Get alert configuration
 */
const getAlertConfiguration = catchAsync(async (req, res) => {
  const config = alertService.getAlertConfiguration();
  res.send(config);
});

module.exports = {
  getAuditLogs,
  getEntityAuditTrail,
  getMyAuditTrail,
  getAuditLogsByCategory,
  getSecurityAuditTrail,
  getFinancialAuditTrail,
  getInventoryAuditTrail,
  searchAuditLogs,
  exportToCSV,
  exportToPDF,
  getExportStats,
  archiveOldLogs,
  getRetentionPolicy,
  getArchiveStats,
  runAlertChecks,
  getAlertConfiguration
};
