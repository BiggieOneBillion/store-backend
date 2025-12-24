const express = require("express");
const { auth } = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const stockHistoryController = require("./stockHistory.controller");
const stockHistoryValidation = require("./stockHistory.validation");

const router = express.Router();

router
  .route("/")
  .post(
    auth("jwt", "manageUsers"),
    validate(stockHistoryValidation.createStockEntry),
    stockHistoryController.createStockEntry
  )
  .get(
    auth("jwt", "manageUsers"),
    validate(stockHistoryValidation.getStockHistory),
    stockHistoryController.getStockHistory
  );

router
  .route("/product/:productId")
  .get(
    auth("jwt", "manageUsers"),
    validate(stockHistoryValidation.getProductStockHistory),
    stockHistoryController.getProductStockHistory
  );

// router
//   .route('/product/:productId/summary')
//   .get(
//     auth('manageUsers'),
//     validate(stockHistoryValidation.getProductStockHistory),
//     stockHistoryController.getStockSummary
//   );

module.exports = router;
