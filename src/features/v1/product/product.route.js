const express = require("express");
const auth = require("../../../middlewares/auth");
const validateFormData = require("../../../middlewares/validateFormData");
const validate = require("../../../middlewares/validate");
const { productValidation, productController } = require("./index");
const getStore = require("../../../middlewares/isStoreOwner");
const productExistInStore = require("../../../middlewares/productExitInStore");

const router = express.Router();

// GET ALL PRODUCTS FROM ALL STORES.
router.route("/").get(productController.getAllStoreProducts);
router.route("/detail/:productId").get(productController.getProduct);
router
  .route("/related/:productId/:categoryId")
  .get(productController.getRelatedProducts);

// api route for owner of store to perform CRUD operations on their products
router
  .route("/:userId")
  .post(
    // CREATE PRODUCT
    auth("manageUsers"),
    validateFormData(productValidation.createProduct),
    // getStore(),
    productController.createProduct
  )
  .get(
    // GET ALL PRODUCTS IN USER STORE
    auth("getUsers"),
    validate(productValidation.getAllProducts),
    // getStore(),
    productController.getAllProducts
  );

router
  .route("/:userId/:productId")
  .get(
    // GET SINGLE PRODUCT BY ID
    auth("manageUsers"), // is user allowed to access this endpoint
    validate(productValidation.getProduct), // validate the body data
    // getStore(), // check if user has a store
    productExistInStore(), // check if the product exist in the store
    productController.getProduct // get the product from the store and return it
  )
  .patch(
    // UPDATE SINGLE PRODUCT BY ID
    auth("manageUsers"), // is user allowed to access this endpoint
    validate(productValidation.productParams),
    validateFormData(productValidation.updateProduct), // validate the body data
    // getStore(), // check if user has a store
    productExistInStore(), // check if the product exist in the store
    productController.updateProduct // update the product
  )
  .delete(
    // DELETE SINGLE PRODUCT BY ID
    auth("manageUsers"),
    // validate(productValidation.deleteProduct),
    // getStore(),
    // productExistInStore(),
    productController.deleteProduct
  );

// api router for the frontend to display products
// 1.list of product under a store -- params : storeId --access-public
// 2.product details of a particular product ---params : productId --access-public

module.exports = router;
