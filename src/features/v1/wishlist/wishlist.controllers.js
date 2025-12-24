const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const { wishlistService } = require("./index");

const addToWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.addToWishlist({
    ...req.body,
    user: req.user.id,
  });
  res.status(httpStatus.OK).send(wishlist);
});

const getWishlists = catchAsync(async (req, res) => {
  const result = await wishlistService.getUserWishlist(req.user._id);

  // console.log("WISHLIST RESULT ----------------", result);
  //   const filter = pick(req.query, ["user", "store"]);
  //   const options = pick(req.query, ["sortBy", "limit", "page"]);
  //   const result = await wishlistService.queryWishlists(filter, options);
  res.send(result);
});

const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlistById(req.params.wishlistId);
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found");
  }
  res.send(wishlist);
});

const removeFromWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.removeFromWishlist(
    req.user.id,
    req.params.productId,
    // req.params.storeId
  );
  res.send(wishlist);
});

const clearWishlist = catchAsync(async (req, res) => {
  //  console.log("------------PASSES-------------")
  await wishlistService.clearWishlist(req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  addToWishlist,
  getWishlists,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
};
