const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const { productService } = require("./index");
const { uploadImage } = require("../storage/cloudinary.service");

// Product Controllers
const createProduct = catchAsync(async (req, res) => {
  if (req.files) {
    const upload = await uploadImage(req.files["images[]"].tempFilePath);
    if (!upload) {
      throw new ApiError(httpStatus[503], "Image Upload Down");
    }
    const product = await productService.createProduct({
      ...req.body,
      store: req.store._id,
      images: [upload.secure_url],
    });
    res.status(httpStatus.CREATED).send(product);
    return;
  }
  const product = await productService.createProduct({
    ...req.body,
    store: req.store._id,
  });
  res.status(httpStatus.CREATED).send(product);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "name",
    "category",
    "store",
    "status",
    "price",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

const getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts(req.store._id);
  res.send(products);
});

const getAllStoreProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllStoreProducts()
  res.send(products);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(
    req.params.productId,
    req.body
  );
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllStoreProducts
};
