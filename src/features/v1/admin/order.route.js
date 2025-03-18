const express = require("express");
const auth = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { orderController, orderValidation } = require("../order");

const router = express.Router();

router.get(
  "/admin/order",
  auth("getOrders"),
  orderController.getAllOrder
);
