const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const {
  product: {
    productService: { getProductById },
  },
  store: {
    storeService: { getStoreByOwnerId },
  },
} = require("../index");
const Review = require("./review.model")

// Review Service
const createReview = async (reviewBody) => {
  // Verify product and store exist
  const product = await getProductById(reviewBody.product);
  const store = await getStoreByOwnerId(reviewBody.store);
  if (!product || !store) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product or store not found");
  }
  return Review.create(reviewBody);
};

const queryReviews = async (filter, options) => {
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

const getReviewById = async (id) => {
  return Review.findById(id);
};

const updateReviewById = async (reviewId, updateBody) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }
  await review.remove();
  return review;
};

module.exports = {
  // Review Service
  createReview,
  queryReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
