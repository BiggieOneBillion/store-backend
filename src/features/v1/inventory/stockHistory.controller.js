const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const stockHistoryService = require("./stockHistory.service");

const stockHistoryController = {
  createStockEntry: catchAsync(async (req, res) => {
    const stockHistory = await stockHistoryService.createStockEntry(req.body);
    res.status(httpStatus.CREATED).send(stockHistory);
  }),

  getStockHistory: catchAsync(async (req, res) => {
    const filter = req.query;
    const options = req.query;
    const result = await stockHistoryService.getStockHistory(filter, options);
    res.send(result);
  }),

  getProductStockHistory: catchAsync(async (req, res) => {
    const history = await stockHistoryService.getProductStockHistory(
      req.params.productId
    );
    res.send(history);
  }),

  // getStockSummary: catchAsync(async (req, res) => {
  //   const summary = await stockHistoryService.getStockSummary(req.params.productId);
  //   res.send(summary);
  // })
};

module.exports = stockHistoryController;
