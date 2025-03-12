const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../../utils/plugins");

// Purchase Schema (for admin tracking)
const purchaseSchema = mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  totalAmount: { type: Number, required: true },
  commission: { type: Number, required: true }, // Platform commission
  sellerPayout: { type: Number, required: true }, // Amount to be paid to seller
  status: {
    type: String,
    enum: ["pending", "completed", "disputed", "refunded"],
    default: "pending",
  },
  disputeDetails: {
    isDisputed: { type: Boolean, default: false },
    reason: String,
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "closed"],
      default: "open",
    },
    openedAt: Date,
    resolvedAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
purchaseSchema.plugin(toJSON);
purchaseSchema.plugin(paginate);

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
