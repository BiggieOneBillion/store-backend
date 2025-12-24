const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../utils/plugins');

const stockHistorySchema = mongoose.Schema(
  {
    // Links to the product whose stock is being modified
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    // Describes what kind of stock change occurred
    // - sale: Stock decreased due to purchase
    // - restock: New inventory added
    // - refund: Stock returned from cancelled order
    // - adjustment: Manual stock correction
    // - return: Customer returned items
    type: {
      type: String,
      enum: ['sale', 'restock', 'refund', 'adjustment', 'return'],
      required: true
    },

    // The amount of stock changed (positive for additions, negative for reductions)
    quantity: {
      type: Number,
      required: true
    },

    // Stock level before this transaction
    previousStock: {
      type: Number,
      required: true
    },

    // Stock level after this transaction
    newStock: {
      type: Number,
      required: true
    },

    // Human-readable identifier for the transaction
    // Examples: "ORDER-123", "RESTOCK-456", "RETURN-789"
    reference: {
      type: String,
      required: true
    },

    // Categorizes the source of the stock change
    // - order: Stock changed due to customer purchase
    // - manual: Admin manually adjusted stock
    // - return: Stock returned by customer
    // - adjustment: System or inventory reconciliation
    referenceType: {
      type: String,
      enum: ['order', 'manual', 'return', 'adjustment'],
      required: true
    },

    // ID of the related document (Order ID, Return ID, etc.)
    // Used to trace back to the original transaction
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // Additional information about the stock change
    // Examples: "Damaged inventory removal", "Seasonal restock"
    notes: String,

    // User who performed or authorized this stock change
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Add plugins
// stockHistorySchema.plugin(toJSON);
stockHistorySchema.plugin(paginate);

const StockHistory = mongoose.model('StockHistory', stockHistorySchema);

module.exports = StockHistory;