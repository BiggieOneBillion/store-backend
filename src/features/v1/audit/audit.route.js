const express = require('express');
const { auth } = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const auditController = require('./audit.controller');
const auditValidation = require('./audit.validation');

const router = express.Router();

// Get all audit logs (admin only)
router.get(
  '/',
  auth('jwt', 'manageUsers'),
  validate(auditValidation.getAuditLogs),
  auditController.getAuditLogs
);

// Get audit trail for specific entity (admin only)
router.get(
  '/entity/:entityType/:entityId',
  auth('jwt', 'manageUsers'),
  validate(auditValidation.getEntityAuditTrail),
  auditController.getEntityAuditTrail
);

// Get user's own audit trail
router.get(
  '/my-activity',
  auth('jwt'),
  auditController.getMyAuditTrail
);

// Get audit trail by category (admin only)
router.get(
  '/category/:category',
  auth('jwt', 'manageUsers'),
  validate(auditValidation.getByCategory),
  auditController.getAuditLogsByCategory
);

// Get security audit trail (admin only)
router.get(
  '/security',
  auth('jwt', 'manageUsers'),
  auditController.getSecurityAuditTrail
);

// Get financial audit trail (admin only)
router.get(
  '/financial',
  auth('jwt', 'manageUsers'),
  auditController.getFinancialAuditTrail
);

// Get inventory audit trail (admin only)
router.get(
  '/inventory',
  auth('jwt', 'manageUsers'),
  auditController.getInventoryAuditTrail
);

// Search audit logs (admin only)
router.get(
  '/search',
  auth('jwt', 'manageUsers'),
  validate(auditValidation.searchAuditLogs),
  auditController.searchAuditLogs
);

// Export endpoints (admin only)
router.get(
  '/export/csv',
  auth('jwt', 'manageUsers'),
  auditController.exportToCSV
);

router.get(
  '/export/pdf',
  auth('jwt', 'manageUsers'),
  auditController.exportToPDF
);

router.get(
  '/export/stats',
  auth('jwt', 'manageUsers'),
  auditController.getExportStats
);

// Retention policy endpoints (admin only)
router.post(
  '/retention/archive',
  auth('jwt', 'manageUsers'),
  auditController.archiveOldLogs
);

router.get(
  '/retention/policy',
  auth('jwt', 'manageUsers'),
  auditController.getRetentionPolicy
);

router.get(
  '/retention/stats',
  auth('jwt', 'manageUsers'),
  auditController.getArchiveStats
);

// Alert endpoints (admin only)
router.post(
  '/alerts/check',
  auth('jwt', 'manageUsers'),
  auditController.runAlertChecks
);

router.get(
  '/alerts/config',
  auth('jwt', 'manageUsers'),
  auditController.getAlertConfiguration
);

module.exports = router;
