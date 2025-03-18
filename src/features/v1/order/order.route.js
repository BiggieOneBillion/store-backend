const express = require("express");
const auth = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { orderController, orderValidation } = require("../order");

const router = express.Router();

router
  .route("/")
  .post(
    // create an order
    auth("getUsers"),
    validate(orderValidation.createOrder),
    orderController.createOrder
  )
  .get(auth("getUsers"), orderController.getAllOrder);

router.route("/:userId").get(
  // get all order
  auth("getUsers"),
  validate(orderValidation.getOrder),
  orderController.getUserOrderList
);

router
  .route("/:userId/:orderId")
  .patch(
    // update a particular order
    auth("getUsers"),
    validate(orderValidation.updateOrder),
    orderController.updateOrder
  )
  .delete(
    auth("getUser"),
    validate(orderValidation.deleteOrder),
    orderController.deleteOrder
  );

module.exports = router;
