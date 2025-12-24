const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
// const { discountService } = require('./index');
const discountService = require("../discount/discount.service");

const discountController = {
  createDiscount: catchAsync(async (req, res) => {
    const discount = await discountService.createDiscount(req.body);
    res.status(httpStatus.CREATED).send(discount);
  }),

  getDiscounts: catchAsync(async (req, res) => {
    const filter = req.query;
    const options = req.query;
    const result = await discountService.getDiscounts(filter, options);
    res.send(result);
  }),

  getAllDiscounts: catchAsync(async (req, res) => {
    const result = await discountService.getAllDiscounts();
    res.send(result);
  }),

  getDiscountByCode: catchAsync(async (req, res) => {
    const discount = await discountService.getDiscountByCode(req.params.code);
    res.send(discount);
  }),

  validateDiscount: catchAsync(async (req, res) => {
    const { code, cartTotal } = req.body;
    const discount = await discountService.validateDiscount(
      code,
      req.user.id,
      cartTotal
    );
    res.send(discount);
  }),

  applyProductDiscount: catchAsync(async (req, res) => {
    const product = await discountService.applyProductDiscount(
      req.params.productId,
      req.body
    );
    res.send(product);
  }),

  applyVariantDiscount: catchAsync(async (req, res) => {
    const product = await discountService.applyVariantDiscount(
      req.params.productId,
      req.params.variantId,
      req.body
    );
    res.send(product);
  }),

  applyCategoryDiscount: catchAsync(async (req, res) => {
    const result = await discountService.applyCategoryDiscount(
      req.params.category,
      req.body
    );
    res.send(result);
  }),

  updateDiscount: catchAsync(async (req, res) => {
    const discount = await discountService.updateDiscount(
      req.params.discountId,
      req.body
    );
    res.send(discount);
  }),

  updateDiscountStatus: catchAsync(async (req, res) => {
    const discount = await discountService.updateDiscountStatus(
      req.params.discountId,
      req.body.active
    );
    res.send(discount);
  }),

  deleteDiscount: catchAsync(async (req, res) => {
    await discountService.deleteDiscount(req.params.discountId);
    res.status(httpStatus.NO_CONTENT).send();
  }),
};

module.exports = discountController;
