# Audit Trail System - Usage Guide

## Quick Start

The audit trail system is now active and automatically logging all authenticated requests. Here's how to use it:

## Automatic Logging

**No action required!** The system automatically logs:
- All authenticated API requests
- Request method, endpoint, status code
- Response time
- User information, IP address, device

## Viewing Audit Logs

### 1. View Your Own Activity

Any authenticated user can view their own activity:

```bash
GET /v1/audit/my-activity?page=1&limit=50
Authorization: Bearer {your_access_token}
```

### 2. View All Audit Logs (Admin Only)

```bash
GET /v1/audit?page=1&limit=100
Authorization: Bearer {admin_access_token}
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `user` - Filter by user ID
- `action` - Filter by action (LOGIN, CREATE, UPDATE, DELETE, etc.)
- `entityType` - Filter by entity (User, Product, Order, etc.)
- `category` - Filter by category (SECURITY, FINANCIAL, INVENTORY, etc.)
- `severity` - Filter by severity (INFO, WARNING, ERROR, CRITICAL)
- `status` - Filter by status (SUCCESS, FAILURE, PENDING)
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

### 3. View Security Audit Trail (Admin Only)

Track all authentication events:

```bash
GET /v1/audit/security?page=1&limit=50
Authorization: Bearer {admin_access_token}
```

**Shows:**
- Login/logout events
- Failed login attempts
- Password resets
- Email verifications
- Permission changes

### 4. View Financial Audit Trail (Admin Only)

Track all payment and order events:

```bash
GET /v1/audit/financial?page=1&limit=50
Authorization: Bearer {admin_access_token}
```

**Shows:**
- Payment initialization
- Payment completion/failure
- Order creation/updates
- Discount applications

### 5. View Inventory Audit Trail (Admin Only)

Track all product and stock changes:

```bash
GET /v1/audit/inventory?page=1&limit=50
Authorization: Bearer {admin_access_token}
```

**Shows:**
- Product creation/updates/deletion
- Stock updates
- Inventory adjustments

### 6. View Entity Audit Trail (Admin Only)

View all actions on a specific entity:

```bash
GET /v1/audit/entity/Order/order_123
Authorization: Bearer {admin_access_token}
```

**Entity Types:**
- User
- Store
- Product
- Order
- Payment
- Discount
- Category
- Wishlist
- StockHistory
- UserAddress

### 7. Search Audit Logs (Admin Only)

Advanced search with multiple filters:

```bash
GET /v1/audit/search?action=LOGIN_FAILED&severity=WARNING&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {admin_access_token}
```

## Common Use Cases

### Monitor Failed Login Attempts

```bash
GET /v1/audit/search?action=LOGIN_FAILED&page=1
```

### Track Order Changes

```bash
GET /v1/audit/entity/Order/{orderId}
```

### View Recent Security Events

```bash
GET /v1/audit/security?page=1&limit=20
```

### Find Payment Failures

```bash
GET /v1/audit/financial?severity=ERROR&status=FAILURE
```

### Track User Activity

```bash
GET /v1/audit?user={userId}&startDate=2024-01-01
```

## Response Format

```json
{
  "results": [
    {
      "id": "audit_log_id",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "role": "buyer"
      },
      "userEmail": "user@example.com",
      "userRole": "buyer",
      "action": "LOGIN",
      "entityType": "Auth",
      "category": "SECURITY",
      "severity": "INFO",
      "status": "SUCCESS",
      "metadata": {
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "device": "desktop",
        "method": "POST",
        "endpoint": "/v1/auth/login",
        "statusCode": 200,
        "responseTime": 45
      },
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 50,
  "totalPages": 10,
  "totalResults": 500
}
```

## Action Types

- `CREATE` - Resource creation
- `READ` - Resource read
- `UPDATE` - Resource update
- `DELETE` - Resource deletion
- `LOGIN` - Successful login
- `LOGOUT` - User logout
- `LOGIN_FAILED` - Failed login attempt
- `PASSWORD_RESET` - Password reset
- `PASSWORD_RESET_REQUEST` - Password reset requested
- `EMAIL_VERIFIED` - Email verified
- `PAYMENT_INITIATED` - Payment started
- `PAYMENT_COMPLETED` - Payment successful
- `PAYMENT_FAILED` - Payment failed
- `ORDER_CREATED` - Order created
- `ORDER_UPDATED` - Order updated
- `ORDER_CANCELLED` - Order cancelled
- `PRODUCT_CREATED` - Product created
- `PRODUCT_UPDATED` - Product updated
- `PRODUCT_DELETED` - Product deleted
- `STORE_CREATED` - Store created
- `STORE_UPDATED` - Store updated
- `STORE_SUSPENDED` - Store suspended
- `DISCOUNT_APPLIED` - Discount applied
- `STOCK_UPDATED` - Stock updated
- `PERMISSION_CHANGED` - Permission changed
- `ROLE_CHANGED` - User role changed

## Categories

- `SECURITY` - Authentication and authorization
- `FINANCIAL` - Payments and orders
- `INVENTORY` - Products and stock
- `USER_ACTIVITY` - General user actions
- `ADMIN` - Administrative operations
- `SYSTEM` - System events

## Severity Levels

- `INFO` - Normal operations
- `WARNING` - Potential issues
- `ERROR` - Errors occurred
- `CRITICAL` - Critical failures

## Status Values

- `SUCCESS` - Operation succeeded
- `FAILURE` - Operation failed
- `PENDING` - Operation in progress

## Best Practices

1. **Regular Monitoring** - Check security logs daily
2. **Failed Logins** - Investigate multiple failed attempts
3. **Financial Audits** - Review payment failures
4. **Compliance** - Export logs for regulatory requirements
5. **Performance** - Use date ranges to limit results
6. **Privacy** - Respect user data protection laws

## Manual Logging (For Developers)

If you need to add custom audit logging in your controllers:

```javascript
const auditService = require('../audit/audit.service');

// Log user action
await auditService.logUserAction({
  user: req.user,
  action: 'PRODUCT_CREATED',
  entityType: 'Product',
  entityId: product.id,
  changes: {
    before: null,
    after: product
  },
  metadata: {
    ip: req.ip,
    userAgent: req.get('user-agent')
  },
  category: 'INVENTORY',
  description: `Product "${product.name}" created`
});

// Log auth event
await auditService.logAuthEvent({
  user: req.user,
  action: 'LOGIN',
  status: 'SUCCESS',
  metadata: {
    ip: req.ip,
    userAgent: req.get('user-agent')
  }
});

// Log payment event
await auditService.logPaymentEvent({
  user: req.user,
  action: 'PAYMENT_COMPLETED',
  orderId: order.id,
  amount: order.total,
  status: 'SUCCESS',
  metadata: {
    ip: req.ip,
    reference: paymentReference
  }
});
```

## Troubleshooting

### No Logs Appearing

1. Ensure you're authenticated (audit only logs authenticated requests)
2. Check that audit middleware is enabled in `app.js`
3. Verify MongoDB connection

### Permission Denied

- Most endpoints require admin role (`manageUsers` permission)
- Users can only view their own activity via `/my-activity`

### Slow Queries

- Use date ranges to limit results
- Ensure MongoDB indexes are created
- Use pagination (smaller page sizes)

## Support

For issues or questions:
1. Check the [Implementation Plan](file:///Users/chukwuchinwendu/.gemini/antigravity/brain/6bcbaad1-e9b6-4e2c-a626-637caafac246/implementation_plan.md)
2. Review the [Walkthrough](file:///Users/chukwuchinwendu/.gemini/antigravity/brain/6bcbaad1-e9b6-4e2c-a626-637caafac246/walkthrough.md)
3. Check audit service code for available functions
