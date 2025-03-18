const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Product = require("../features/v1/product/product.model");

const productExistInStore = () => async (req, res, next) => {
  const product = await Product.findOne({
    // store: req.store._id,
    _id: req.params.productId,
  });
  if (!product) {
    return next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        "This store does not have this product"
      )
    );
  }
  return next();
};

module.exports = productExistInStore;
