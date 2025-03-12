// const mongoose = require("mongoose");
// const { toJSON, paginate } = require("./plugins");

// // Payment Schema
// const paymentSchema = mongoose.Schema({
//   amount: { type: Number, required: true },
//   currency: { type: String, required: true, default: "USD" },
//   paymentMethod: {
//     type: String,
//     enum: ["credit_card", "debit_card", "bank_transfer", "wallet", "paypal"],
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "processing", "completed", "failed", "refunded"],
//     default: "pending",
//   },
//   paymentGateway: { type: String, required: true }, // e.g., 'stripe', 'paypal'
//   gatewayTransactionId: { type: String, required: true },
//   gatewayResponse: mongoose.Schema.Types.Mixed, // Store raw gateway response
//   refundStatus: {
//     type: String,
//     enum: ["none", "partial", "full"],
//     default: "none",
//   },
//   refundAmount: { type: Number, default: 0 },
//   paymentDate: { type: Date },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // add plugin that converts mongoose to json
// paymentSchema.plugin(toJSON);
// paymentSchema.plugin(paginate);

// const Payment = mongoose.model("Payment", paymentSchema);

// module.exports = Payment;

const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../../utils/plugins");

const paymentSchema = mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
  provider: { type: String, default: "paystack" },
  reference: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  paymentDetails: {
    authorization_url: String,
    access_code: String,
    transaction_date: Date,
    gateway_response: String,
    channel: String,
    card_type: String,
    bank: String,
    last4: String,
  },
  metadata: {
    type: Map,
    of: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
