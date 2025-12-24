const express = require("express");
const { auth } = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const discountValidation = require("./discount.validation");
const discountController = require("./discount.controller");

const router = express.Router();

// Admin routes for managing discounts
router
  .route("/")
  .post(
    auth("jwt", "manageUsers"),
    validate(discountValidation.createDiscount),
    discountController.createDiscount
  )
  .get(
    auth("jwt", "manageUsers"),
    validate(discountValidation.getDiscounts),
    discountController.getAllDiscounts
  );

router
  .route("/:discountId")
  .patch(
    auth("jwt", "manageUsers"),
    validate(discountValidation.updateDiscount),
    discountController.updateDiscount
  )
  .delete(
    auth("jwt", "manageUsers"),
    validate(discountValidation.deleteDiscount),
    discountController.deleteDiscount
  );

router
  .route("/:discountId/status")
  .patch(
    auth("jwt", "manageUsers"),
    validate(discountValidation.updateDiscountStatus),
    discountController.updateDiscountStatus
  );

// Routes for applying discounts
router
  .route("/product/:productId")
  .post(
    auth("jwt", "manageUsers"),
    validate(discountValidation.applyProductDiscount),
    discountController.applyProductDiscount
  );

router
  .route("/product/:productId/variant/:variantId")
  .post(
    auth("jwt", "manageUsers"),
    validate(discountValidation.applyVariantDiscount),
    discountController.applyVariantDiscount
  );

router
  .route("/category/:category")
  .post(
    auth("jwt", "manageUsers"),
    validate(discountValidation.applyCategoryDiscount),
    discountController.applyCategoryDiscount
  );

// Public routes for validating discount codes
router
  .route("/validate")
  .post(
    auth(),
    validate(discountValidation.validateDiscount),
    discountController.validateDiscount
  );

router
  .route("/code/:code")
  .get(
    validate(discountValidation.getDiscountByCode),
    discountController.getDiscountByCode
  );

module.exports = router;
