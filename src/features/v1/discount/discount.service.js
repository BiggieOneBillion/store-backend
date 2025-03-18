const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');
const Discount = require('./discount.model');
const Product = require('../product/product.model');

const discountService = {
  createDiscount: async (discountBody) => {
    // Generate unique code if not provided
    if (!discountBody.code) {
      discountBody.code = generateDiscountCode();
    }
    return Discount.create(discountBody);
  },

  validateDiscount: async (code, userId, cartTotal) => {
    const discount = await Discount.findOne({ code: code.toUpperCase() });
    if (!discount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Discount code not found');
    }

    if (!discount.isValid(userId, cartTotal)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid discount code');
    }

    return discount;
  },

  applyProductDiscount: async (productId, discountData) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // Apply discount to product
    product.discount = {
      type: discountData.type,
      value: discountData.value,
      startDate: discountData.startDate,
      endDate: discountData.endDate,
      active: true
    };

    await product.save();
    return product;
  },

  applyVariantDiscount: async (productId, variantId, discountData) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Variant not found');
    }

    // Apply discount to variant
    variant.discount = {
      type: discountData.type,
      value: discountData.value,
      startDate: discountData.startDate,
      endDate: discountData.endDate,
      active: true
    };

    await product.save();
    return product;
  },

  applyCategoryDiscount: async (category, discountData) => {
    const result = await Product.updateMany(
      { category },
      {
        $set: {
          discount: {
            type: discountData.type,
            value: discountData.value,
            startDate: discountData.startDate,
            endDate: discountData.endDate,
            active: true
          }
        }
      }
    );
    return result;
  },

  getDiscounts: async (filter, options) => {
    const discounts = await Discount.paginate(filter, options);
    return discounts;
  },

  getDiscountByCode: async (code) => {
    return Discount.findOne({ code: code.toUpperCase() });
  },

  updateDiscount: async (discountId, updateBody) => {
    const discount = await Discount.findById(discountId);
    if (!discount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
    }
    Object.assign(discount, updateBody);
    await discount.save();
    return discount;
  },

  deleteDiscount: async (discountId) => {
    const discount = await Discount.findById(discountId);
    if (!discount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
    }
    await discount.remove();
    return discount;
  }
};

// Helper function to generate unique discount code
const generateDiscountCode = () => {
  const prefix = 'DISC';
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomString}`;
};

module.exports = discountService;