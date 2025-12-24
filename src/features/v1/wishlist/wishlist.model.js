const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // store: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'Store',
        //   required: true
        // },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
wishlistSchema.index({ user: 1 });

module.exports =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
