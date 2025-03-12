const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../../utils/plugins");

// Store Schema
const storeSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  logo: { type: String, required: false },
  bannerImage: { type: String, required: false },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  categories: [String],
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
storeSchema.plugin(toJSON);
storeSchema.plugin(paginate);

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
