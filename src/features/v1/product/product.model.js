const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../../utils/plugins");
const mongoosePaginate = require("mongoose-paginate-v2");

// Product Schema
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  tag: {
    type: String,
    enum: ["latest", "featured", "regular", "sale"],
    default: "regular",
  },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  discount: {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    value: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    active: { type: Boolean, default: false },
  },
  variants: [
    {
      name: String,
      options: [String],
      price: Number,
      quantity: Number,
      sku: String,
      discount: {
        type: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "percentage",
        },
        value: { type: Number, default: 0 },
        startDate: Date,
        endDate: Date,
        active: { type: Boolean, default: false },
      },
    },
  ],
  images: [String],
  inventory: {
    quantity: { type: Number, required: true },
    sku: { type: String, required: true },
    lowStockThreshold: { type: Number, default: 5 },
    sold: { type: Number, default: 0 },
  },
  // variants: [
  //   {
  //     name: String,
  //     options: [String],
  //     price: Number,
  //     quantity: Number,
  //     sku: String,
  //   },
  // ],
  specifications: [
    {
      name: String,
      value: String,
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive", "out_of_stock", "deactivated"],
    default: "active",
  },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  "specifications.name": "text",
  "specifications.value": "text",
  "variants.name": "text",
  "variants.options": "text",
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ "inventory.sku": 1 });

productSchema.plugin(mongoosePaginate);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
// productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
