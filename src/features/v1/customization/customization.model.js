const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../utils/plugins');

const customizationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  image: {
    type: String
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
customizationSchema.plugin(toJSON);
customizationSchema.plugin(paginate);

// Add index for better query performance
customizationSchema.index({ slug: 1 });
customizationSchema.index({ parent: 1 });
customizationSchema.index({ status: 1 });

const Category = mongoose.model('Customization', customizationSchema);

module.exports = Customization;