const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../utils/plugins');

const discountSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  minimumPurchase: {
    type: Number,
    default: 0
  },
  maximumDiscount: {
    type: Number
  },
  usageLimit: {
    perCustomer: { type: Number, default: 1 },
    total: { type: Number }
  },
  usageCount: {
    type: Number,
    default: 0
  },
  applicableTo: {
    type: String,
    enum: ['all', 'category', 'product', 'variant'],
    default: 'all'
  },
  conditions: {
    categories: [{ type: String }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    excludedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add plugins
discountSchema.plugin(toJSON);
discountSchema.plugin(paginate);

// Add method to validate discount code
discountSchema.methods.isValid = function(userId, cartTotal) {
  const now = new Date();
  
  // Check if code is active and within date range
  if (!this.active || now < this.startDate || now > this.endDate) {
    return false;
  }

  // Check usage limits
  if (this.usageLimit.total && this.usageCount >= this.usageLimit.total) {
    return false;
  }

  // Check minimum purchase amount
  if (cartTotal < this.minimumPurchase) {
    return false;
  }

  return true;
};

// Add method to calculate discount amount
discountSchema.methods.calculateDiscount = function(originalPrice) {
  let discountAmount;
  
  if (this.type === 'percentage') {
    discountAmount = (originalPrice * this.value) / 100;
  } else {
    discountAmount = this.value;
  }

  // Apply maximum discount if set
  if (this.maximumDiscount && discountAmount > this.maximumDiscount) {
    discountAmount = this.maximumDiscount;
  }

  return discountAmount;
};

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;