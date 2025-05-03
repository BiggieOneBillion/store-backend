const httpStatus = require("http-status");
const Product = require("./product.model");
const ApiError = require("../../../utils/ApiError");
const mongoose = require("mongoose");

// Product Service

const getProductById = async (id) => {
  return Product.findById(id).populate({
    path: "category",
    select: "name",
  });
};

const getRelatedProducts = async (category, id) => {
  // check if product exist
  const product = await Product.exists({ _id: id });
  // if product does not exist return products with the same category
  if (!product) {
    return await Product.find({
      category: category,
    }).limit(4);
  }
  // if product exist return products with the same category excluding the product
  const products = await Product.find({
    category: category,
    _id: { $ne: id },
  })
    .populate({
      path: "category",
      select: "name",
    })
    .limit(4);
  return products;
};

const createProduct = async (productBody) => {
  return Product.create(productBody);
};

const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

// const getAllProducts = async (id) => {
//   return Product.find({ store: id });
// };

const getAllProducts = async () => {
  return Product.find({ status: { $ne: "deactivated" } }).populate({
    path: "category",
    select: "name",
  });
};

const getAllStoreProducts = async () => {
  return Product.find({ status: { $ne: "deactivated" } }).populate({
    path: "category",
    select: "name",
  });
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await Product.findById({
    _id: mongoose.Types.ObjectId(productId),
  });
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  product.status = "deactivated";
  // console.log("PRODUCT TO DELETE-----", product);
  await product.save();
  return product;
};

module.exports = {
  // Product Service
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProducts,
  getAllStoreProducts,
  getRelatedProducts,
};
