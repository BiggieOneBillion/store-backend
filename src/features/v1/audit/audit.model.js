const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../utils/plugins');

const auditLogSchema = mongoose.Schema({
  // Who performed the action
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: String, // Denormalized for quick access
  userRole: String,
  
  // What action was performed
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE', 'READ', 'UPDATE', 'DELETE',
      'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
      'PASSWORD_RESET', 'PASSWORD_RESET_REQUEST', 'EMAIL_VERIFIED',
      'PAYMENT_INITIATED', 'PAYMENT_COMPLETED', 'PAYMENT_FAILED',
      'ORDER_CREATED', 'ORDER_UPDATED', 'ORDER_CANCELLED',
      'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED',
      'STORE_CREATED', 'STORE_UPDATED', 'STORE_SUSPENDED',
      'DISCOUNT_APPLIED', 'DISCOUNT_CREATED', 'DISCOUNT_UPDATED',
      'STOCK_UPDATED', 'STOCK_RESTOCKED',
      'PERMISSION_CHANGED', 'ROLE_CHANGED',
      'USER_CREATED', 'USER_UPDATED', 'USER_DELETED'
    ]
  },
  
  // What entity was affected
  entityType: {
    type: String,
    required: true,
    enum: [
      'User', 'Store', 'Product', 'Order', 'Payment',
      'Discount', 'Category', 'Wishlist', 'StockHistory',
      'Auth', 'System', 'UserAddress'
    ]
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Some actions don't have entity (e.g., LOGIN)
  },
  
  // Additional context
  changes: {
    before: mongoose.Schema.Types.Mixed, // Previous state
    after: mongoose.Schema.Types.Mixed   // New state
  },
  
  // Request metadata
  metadata: {
    ip: String,
    userAgent: String,
    device: String,
    method: String,      // HTTP method
    endpoint: String,    // API endpoint
    statusCode: Number,
    responseTime: Number, // ms
    amount: Number       // For financial transactions
  },
  
  // Categorization for multiple trails
  category: {
    type: String,
    enum: [
      'SECURITY',      // Auth, permissions
      'FINANCIAL',     // Payments, orders
      'INVENTORY',     // Stock changes
      'USER_ACTIVITY', // User actions
      'ADMIN',         // Admin operations
      'SYSTEM'         // System events
    ],
    required: true
  },
  
  // Severity level
  severity: {
    type: String,
    enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
    default: 'INFO'
  },
  
  // Success or failure
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE', 'PENDING'],
    default: 'SUCCESS'
  },
  
  // Additional notes
  description: String,
  errorMessage: String,
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false // We use custom timestamp field
});

// Indexes for efficient querying
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ category: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 }); // For recent logs
auditLogSchema.index({ 'metadata.ip': 1 });

// Compound index for common queries
auditLogSchema.index({ 
  category: 1, 
  severity: 1, 
  timestamp: -1 
});

// Add plugins
auditLogSchema.plugin(toJSON);
auditLogSchema.plugin(paginate);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
