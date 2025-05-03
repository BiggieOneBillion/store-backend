const StockHistory = require("./stockHistory.model");
const Product = require("../product/product.model");
const ApiError = require("../../../utils/ApiError");
const httpStatus = require("http-status");

const stockHistoryService = {
  createStockEntry: async (stockData) => {
    const product = await Product.findById(stockData.product);

    if (!product || product.status === "deactivated") {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    const previousStock = product.inventory.quantity;
    // console.log("FROM SERVICE previous stock", previousStock);
    const newStock = previousStock + stockData.quantity;

    // console.log("FROM SERVICE newstock", newStock);

    // Create stock history entry
    const stockHistory = await StockHistory.create({
      ...stockData,
      previousStock,
      newStock,
    });

    // Update product stock
    product.inventory.quantity = newStock;
    await product.save();

    return stockHistory;
  },

  getStockHistory: async (filter, options) => {
    const stockHistory = await StockHistory.paginate(filter, options);

    // Populate after pagination
    await StockHistory.populate(stockHistory.results, [
      { path: "product", select: "name inventory.sku" },
      { path: "performedBy", select: "name email" },
    ]);

    return stockHistory;
  },

  getProductStockHistory: async (productId) => {
    return StockHistory.find({ product: productId })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });
  },
};

module.exports = stockHistoryService;
