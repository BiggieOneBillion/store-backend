# Audit Trail Enhancements - Complete Guide

## Overview

The audit trail system has been enhanced with powerful features for retention management, data export, and real-time alerts.

## New Features

### 1. Retention Policy

Automatically archive or delete old audit logs based on category-specific retention periods.

**Default Retention Periods:**
- Security: 365 days (1 year)
- Financial: 2,555 days (7 years - compliance)
- Inventory: 180 days (6 months)
- User Activity: 90 days (3 months)
- Admin: 730 days (2 years)
- System: 30 days (1 month)

**Endpoints:**

```bash
# Get retention policy
GET /v1/audit/retention/policy
Authorization: Bearer {admin_token}

# Get archive statistics
GET /v1/audit/retention/stats
Authorization: Bearer {admin_token}

# Archive old logs
POST /v1/audit/retention/archive?category=SECURITY
Authorization: Bearer {admin_token}
```

**Automated Archival:**
- Runs daily at 2 AM
- Archives logs older than retention period
- Logs archival results

### 2. Export Functionality

Export audit logs to CSV or PDF for reporting and compliance.

**CSV Export:**
```bash
GET /v1/audit/export/csv?category=FINANCIAL&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {admin_token}
```

**PDF Export:**
```bash
GET /v1/audit/export/pdf?category=SECURITY&limit=1000
Authorization: Bearer {admin_token}
```

**Export Statistics:**
```bash
GET /v1/audit/export/stats?category=FINANCIAL
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "totalRecords": 5000,
  "estimatedCSVSize": "1.43 MB",
  "estimatedPDFSize": "0.48 MB",
  "recommendedLimit": 5000
}
```

**Features:**
- CSV includes all audit fields
- PDF includes formatted table with key fields
- Automatic filename with timestamp
- Supports filtering by category, date range, etc.
- Recommended limits to prevent timeouts

### 3. Real-time Alerts

Detect and notify about suspicious activities.

**Alert Rules:**
- Failed Login: 5 attempts within 15 minutes
- Payment Failure: 3 failures within 1 hour
- Suspicious IP: 10+ actions within 5 minutes
- Critical Errors: Immediate notification

**Endpoints:**

```bash
# Run alert checks manually
POST /v1/audit/alerts/check
Authorization: Bearer {admin_token}

# Get alert configuration
GET /v1/audit/alerts/config
Authorization: Bearer {admin_token}
```

**Alert Response:**
```json
{
  "alertsFound": 2,
  "alerts": [
    {
      "alert": true,
      "type": "FAILED_LOGIN",
      "severity": "WARNING",
      "message": "5 failed login attempts detected for user user@example.com in the last 15 minutes",
      "count": 5,
      "userId": "user@example.com"
    },
    {
      "alert": true,
      "type": "SUSPICIOUS_IP",
      "severity": "WARNING",
      "message": "12 actions detected from IP 192.168.1.100 in the last 5 minutes",
      "count": 12,
      "ip": "192.168.1.100"
    }
  ]
}
```

**Automated Checks:**
- Runs every 15 minutes
- Checks all alert rules
- Logs warnings for detected alerts
- Can send email notifications (configurable)

### 4. Enhanced Controller Logging

Added detailed audit logging to key controllers:

**Payment Controller:**
- Payment initialization (success/failure)
- Payment verification (success/failure)
- Transaction details (reference, amount, gateway)

**Example Payment Log:**
```json
{
  "user": "user_id",
  "action": "PAYMENT_COMPLETED",
  "entityType": "Payment",
  "entityId": "order_id",
  "category": "FINANCIAL",
  "severity": "INFO",
  "status": "SUCCESS",
  "metadata": {
    "ip": "192.168.1.1",
    "amount": 2599.98,
    "reference": "ref_xxx",
    "gateway": "paystack",
    "transaction_id": "123456"
  }
}
```

## Installation

The enhancements require additional npm packages:

```bash
npm install json2csv pdfkit node-cron
```

## Configuration

### Enable Automated Jobs

Add to your `src/index.js`:

```javascript
const { initializeAuditCronJobs } = require('./features/v1/audit/audit.cron');

// After MongoDB connection
mongoose.connection.once('open', () => {
  logger.info('Connected to MongoDB');
  
  // Initialize audit cron jobs
  initializeAuditCronJobs();
});
```

### Configure Alert Notifications

Set admin email in `.env`:

```env
ADMIN_EMAIL=admin@yourstore.com
```

### Customize Retention Periods

Edit `src/features/v1/audit/audit.retention.js`:

```javascript
const RETENTION_DAYS = {
  SECURITY: 365,      // Change as needed
  FINANCIAL: 2555,    // 7 years for compliance
  INVENTORY: 180,
  USER_ACTIVITY: 90,
  ADMIN: 730,
  SYSTEM: 30
};
```

### Customize Alert Rules

Edit `src/features/v1/audit/audit.alerts.js`:

```javascript
const ALERT_RULES = {
  FAILED_LOGIN_THRESHOLD: 5,           // Adjust threshold
  FAILED_LOGIN_WINDOW_MINUTES: 15,     // Adjust time window
  PAYMENT_FAILURE_THRESHOLD: 3,
  PAYMENT_FAILURE_WINDOW_MINUTES: 60,
  CRITICAL_ERROR_THRESHOLD: 1,
  SUSPICIOUS_IP_THRESHOLD: 10,
  SUSPICIOUS_IP_WINDOW_MINUTES: 5
};
```

## Usage Examples

### 1. Export Financial Audit Trail

```bash
# Export last month's financial transactions to CSV
GET /v1/audit/export/csv?category=FINANCIAL&startDate=2024-01-01&endDate=2024-01-31
```

### 2. Check for Security Alerts

```bash
# Manually trigger alert checks
POST /v1/audit/alerts/check
```

### 3. Archive Old Logs

```bash
# Archive old security logs
POST /v1/audit/retention/archive?category=SECURITY
```

### 4. View Retention Statistics

```bash
# See how many logs will be archived
GET /v1/audit/retention/stats
```

**Response:**
```json
{
  "SECURITY": {
    "logsToArchive": 1250,
    "cutoffDate": "2023-01-29T00:00:00.000Z",
    "retentionDays": 365
  },
  "FINANCIAL": {
    "logsToArchive": 0,
    "cutoffDate": "2017-01-29T00:00:00.000Z",
    "retentionDays": 2555
  }
}
```

## Best Practices

### Retention
1. **Compliance First**: Keep financial logs for 7 years
2. **Regular Archival**: Run archival weekly or monthly
3. **Backup Before Delete**: Export logs before archiving
4. **Monitor Storage**: Check database size regularly

### Export
1. **Use Filters**: Export specific date ranges
2. **Limit Records**: Use limit parameter for large datasets
3. **Schedule Exports**: Automate monthly compliance reports
4. **Secure Storage**: Store exported files securely

### Alerts
1. **Review Regularly**: Check alerts daily
2. **Tune Thresholds**: Adjust based on your traffic
3. **Act Quickly**: Investigate suspicious activity immediately
4. **Document Incidents**: Keep records of security events

## Monitoring

### Check Cron Job Status

```javascript
// In your application logs
logger.info('Audit cron jobs initialized');
logger.info('Audit log archival scheduled: Daily at 2 AM');
logger.info('Alert checks scheduled: Every 15 minutes');
```

### Monitor Archival

```bash
# Check logs for archival results
grep "Audit log archival" logs/combined.log
```

### Monitor Alerts

```bash
# Check logs for detected alerts
grep "Alert check found" logs/combined.log
```

## Troubleshooting

### Export Timeout

**Problem**: Export takes too long or times out

**Solution**:
- Use date range filters
- Reduce limit parameter
- Export in smaller batches

### Missing Dependencies

**Problem**: `Cannot find module 'json2csv'`

**Solution**:
```bash
npm install json2csv pdfkit node-cron
```

### Cron Jobs Not Running

**Problem**: Automated tasks not executing

**Solution**:
- Check `initializeAuditCronJobs()` is called
- Verify cron syntax
- Check application logs

### Alert Spam

**Problem**: Too many alerts

**Solution**:
- Increase thresholds in `audit.alerts.js`
- Increase time windows
- Add IP whitelist for known sources

## API Reference

### New Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/audit/export/csv` | GET | Export to CSV | Admin |
| `/audit/export/pdf` | GET | Export to PDF | Admin |
| `/audit/export/stats` | GET | Export statistics | Admin |
| `/audit/retention/archive` | POST | Archive old logs | Admin |
| `/audit/retention/policy` | GET | Get retention policy | Admin |
| `/audit/retention/stats` | GET | Archive statistics | Admin |
| `/audit/alerts/check` | POST | Run alert checks | Admin |
| `/audit/alerts/config` | GET | Get alert config | Admin |

## Files Created

1. ✅ `audit.retention.js` - Retention policy service
2. ✅ `audit.export.js` - Export service (CSV/PDF)
3. ✅ `audit.alerts.js` - Alert detection service
4. ✅ `audit.cron.js` - Automated job scheduler

## Files Modified

1. ✅ `audit.controller.js` - Added new endpoints
2. ✅ `audit.route.js` - Added new routes
3. ✅ `paystack.controller.js` - Added payment logging

## Summary

The audit trail system now includes:

- ✅ **Retention Policy** - Automatic archival based on category
- ✅ **CSV Export** - Export logs for reporting
- ✅ **PDF Export** - Generate formatted reports
- ✅ **Real-time Alerts** - Detect suspicious activity
- ✅ **Automated Jobs** - Cron jobs for archival and alerts
- ✅ **Enhanced Logging** - Detailed payment tracking

All features are production-ready and can be customized to your needs!
