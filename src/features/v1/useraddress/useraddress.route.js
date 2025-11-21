const express = require("express");
const { auth } = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { userAddressValidation, userAddressController } = require("./index");
// const { } = require("./index");

const router = express.Router();

router
  .route("/:userId")
  .get(
    auth("jwt", "getUsers"), // Verify user authentication
    validate(userAddressValidation.getUserAddress), // Validate userId parameter
    userAddressController.getUserAddress
  )
  .post(
    auth("jwt", "getUsers"), // Verify user authentication
    validate(userAddressValidation.addToUserAddress), // Validate request body
    userAddressController.addToUserAddress
  );

router
  .route("/:userId/:addressId")
  .delete(
    auth("jwt", "manageUsers"), // Verify user authentication
    validate(userAddressValidation.removeFromUserAddress), // Validate userId parameter
    userAddressController.removeFromUserAddress
  )
  .patch(
    auth("jwt", "getUsers"), // Verify user authentication
    validate(userAddressValidation.updateUserAddress), // Validate request body
    userAddressController.updateUserAddress
  );

module.exports = router;
