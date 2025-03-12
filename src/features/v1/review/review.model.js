const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../../utils/plugins");

// Review Schema
const reviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
