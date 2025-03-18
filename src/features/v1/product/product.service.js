const httpStatus = require("http-status");
const Product = require("./product.model");
const ApiError = require("../../../utils/ApiError");


// Product Service

const getProductById = async (id) => {
  return Product.findById(id);
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
  return Product.find();
};

const getAllStoreProducts = async () => {
  return Product.find().populate({
    path: "store",
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
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  await product.remove();
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
};
