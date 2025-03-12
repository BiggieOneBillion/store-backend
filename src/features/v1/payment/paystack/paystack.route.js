const express = require("express");
const auth = require("../../../../middlewares/auth");
const paystackController  = require("./paystack.controller");

const router = express.Router();


router.post(
  "/initialize/:orderId",
  auth("getUsers"),
  paystackController.initializeTransaction
);
router.get("/verify", paystackController.verifyTransaction);

module.exports = router;
