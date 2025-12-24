const express = require("express");
const { auth } = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const categoryValidation = require("./category.validation");
const categoryController = require("./category.controller");

const router = express.Router();

// Public routes
router.get(
  "/",
  validate(categoryValidation.getCategories),
  categoryController.getCategories
);
router.get("/featured", categoryController.getFeaturedCategories);
router.get(
  "/slug/:slug",
  validate(categoryValidation.getCategoryBySlug),
  categoryController.getCategoryBySlug
);
router.get(
  "/:categoryId",
  validate(categoryValidation.getCategory),
  categoryController.getCategory
);
router.get(
  "/:categoryId/subcategories",
  validate(categoryValidation.getSubcategories),
  categoryController.getSubcategories
);

// Protected routes (admin only)
router
  .route("/")
  .post(
    auth("jwt", "manageUsers"),
    validate(categoryValidation.createCategory),
    categoryController.createCategory
  )
  .get(auth("jwt", "manageUsers"), categoryController.getAllCategories);

router
  .route("/:categoryId")
  .patch(
    auth("jwt", "manageUsers"),
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory
  )
  .delete(
    auth("jwt", "manageUsers"),
    validate(categoryValidation.deleteCategory),
    categoryController.deleteCategory
  );

module.exports = router;
