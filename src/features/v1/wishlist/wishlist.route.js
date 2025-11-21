const express = require("express");
const { auth } = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { wishlistController, wishlistValidation } = require("./index");

const router = express.Router();

// Route for managing wishlist items and retrieving all wishlists
router
  .route("/")
  .post(
    // Add product to user's wishlist
    auth("jwt", "getUsers"), // Verify user authentication
    validate(wishlistValidation.addToWishlist), // Validate request body (productId and storeId)
    wishlistController.addToWishlist
  )
  .get(
    // Get all wishlists with filtering and pagination
    auth("jwt", "getUsers"), // Verify user authentication
    // validate(wishlistValidation.getWishlists), // Validate query parameters
    wishlistController.getWishlists
  );

// Route for getting specific wishlist by ID
router.route("/:wishlistId").get(
  auth("jwt", "getUsers"), // Verify user authentication
  validate(wishlistValidation.getWishlist), // Validate wishlistId parameter
  wishlistController.getWishlist
);

// Route for removing specific product from wishlist
router.route("/:productId/clear").delete(
  auth("jwt", "getUsers"), // Verify user authentication
  validate(wishlistValidation.removeFromWishlist), // Validate productId and storeId parameters
  wishlistController.removeFromWishlist
);

// Route for clearing all items from user's wishlist
router.route("/clear").delete(
  auth("jwt", "getUsers"), // Verify user authentication
  // validate(wishlistValidation.clearWishlist), // Validate userId parameter
  wishlistController.clearWishlist
);

module.exports = router;
