const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../../utils/plugins");

// Product Schema
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  images: [String],
  inventory: {
    quantity: { type: Number, required: true },
    sku: { type: String, required: true },
    lowStockThreshold: { type: Number, default: 5 },
  },
  variants: [
    {
      name: String,
      options: [String],
      price: Number,
      quantity: Number,
      sku: String,
    },
  ],
  specifications: [
    {
      name: String,
      value: String,
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive", "out_of_stock"],
    default: "active",
  },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
