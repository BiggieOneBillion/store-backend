const express = require("express");
const auth = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { paymentController } = require(".");

const router = express.Router();

router.get("/", auth("manageUsers"), paymentController.getAllPayments);

module.exports = router;
