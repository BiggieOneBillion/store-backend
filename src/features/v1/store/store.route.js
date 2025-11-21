const express = require("express");
const { auth } = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const validateFormData = require("../../../middlewares/validateFormData");
const { storeValidation, storeController } = require("./index");

const router = express.Router();

router
  .route("/:userId")
  .post(
    // create a new store
    auth("jwt","getUsers"),
    validate(storeValidation.createStore),
    storeController.createStore
  )
  .get(
    // get a particular user store
    auth("jwt","getUsers"),
    validate(storeValidation.getStore),
    storeController.getStore
  )
  .patch(
    // update a particular user store
    auth("jwt","getUsers"),
    validateFormData(storeValidation.updateStore),
    storeController.updateStore
  );

//  access - publicily accessible route.
// 1. get all stores details
// 2. get store by id details --- params-storeId

// ! To delete a store you have to:
// 1. delete the store,
// 2.any product associated with the store
// 3.any order or transaction associated with the store

module.exports = router;
