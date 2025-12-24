const express = require("express");
const { auth } = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { orderController, orderValidation } = require("../order");

const router = express.Router();

router
  .route("/")
  .post(
    // create an order
    auth("jwt", "getUsers"),
    validate(orderValidation.createOrder),
    orderController.createOrder
  )
  .get(auth("jwt", "manageUsers"), orderController.getAllOrder);

router.route("/:userId").get(
  // get all users order
  auth("jwt", "getUsers"),
  validate(orderValidation.getOrder),
  orderController.getUserOrderList
);

router
  .route("/:userId/:orderId")
  .patch(
    // update a particular order
    auth("jwt", "getUsers"),
    validate(orderValidation.updateOrder),
    orderController.updateOrder
  )
  .delete(
    auth("jwt", "getUser"),
    validate(orderValidation.deleteOrder),
    orderController.deleteOrder
  );

module.exports = router;
