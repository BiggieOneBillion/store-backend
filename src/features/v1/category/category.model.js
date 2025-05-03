const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../utils/plugins');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: false
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  metaTitle: {
    type: String,
    required: false
  },
  metaDescription: {
    type: String,
    required: false
  },
  order: {
    type: Number,
    default: 0
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
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

// Add index for better query performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ status: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;