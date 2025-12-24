const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../../utils/plugins");

const orderSchema = mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      // store: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Store",
      //   required: true,
      // },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      variant: {
        name: String,
        option: String,
      },
    },
  ],
  status: {
    type: String,
    enum: [
      "awaiting_payment",
      "payment_failed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
    default: "awaiting_payment",
  },
  payment: {
    reference: { type: String },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    amount: { type: Number },
    paymentDate: { type: Date },
    gateway: {
      type: String,
      default: "paystack",
    },
    attempts: { type: Number, default: 0 },
    lastAttempt: { type: Date },
    authorization_url: { type: String },
    transaction_id: { type: String },
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  appliedDiscount: {
    code: { type: String },
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: { type: Number },
    amount: { type: Number }, // actual amount discounted
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }
  },
  
  subtotal: { type: Number, required: false },
  discountedTotal: { type: Number }, // New field for post-discount total
  total: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
