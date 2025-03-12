const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const WishList = require("./wishlist.model");
const Product = require("../product/product.model");
const Store = require("../store/store.model");

const addToWishlist = async (wishlistBody) => {
  const { user, productId, storeId } = wishlistBody;

  // Verify product and store exist
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Product ${productId} not found`
    );
  }

  const store = await Store.findById(storeId);
  if (!store) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Store ${storeId} not found`);
  }
  // Find existing wishlist or create new one
  let wishlist = await WishList.findOne({ user });
  if (!wishlist) {
    wishlist = new WishList({ user, products: [] });
  }
  // Check if product already exists in wishlist
  const productExists = wishlist.products.some(
    (item) =>
      item.product.toString() === productId && item.store.toString() === storeId
  );

  if (!productExists) {
    wishlist.products.push({
      product: productId,
      store: storeId,
    });
    await wishlist.save();
  }

  return wishlist;
};

const getUserWishlist = async (userId) => {
  const wishlist = await WishList.findOne({ user: userId }).populate({
    path: "products.product",
    select: "name price description category images",
  });

  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }
  return wishlist;
};

const queryWishlists = async (filter, options) => {
  const wishlists = await WishList.paginate(filter, options);
  return wishlists;
};

const getWishlistById = async (id) => {
  return WishList.findById(id).populate("products.product products.store");
};

const removeFromWishlist = async (userId, productId, storeId) => {
  const wishlist = await WishList.findOne({ user: userId });
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.store.toString() === storeId
      )
  );

  await wishlist.save();
  return wishlist;
};

const clearWishlist = async (userId) => {
  const wishlist = await WishList.findOne({ user: userId });
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }
  wishlist.products = [];
  await wishlist.save();
  return wishlist;
};

module.exports = {
  addToWishlist,
  queryWishlists,
  getWishlistById,
  removeFromWishlist,
  clearWishlist,
  getUserWishlist,
};
