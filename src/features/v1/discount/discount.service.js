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

    // Create the discount
    const discount = await Discount.create(discountBody);

    // Apply discount based on applicableTo value
    switch (discountBody.applicableTo) {
      case 'product':
        if (discountBody.conditions?.products?.length) {
          for (const productId of discountBody.conditions.products) {
            await discountService.applyProductDiscount(productId, {
              type: discountBody.type,
              value: discountBody.value,
              startDate: discountBody.startDate,
              endDate: discountBody.endDate
            });
          }
        }
        break;

      case 'variant':
        if (discountBody.conditions?.products?.length) {
          for (const productId of discountBody.conditions.products) {
            const product = await Product.findById(productId);
            if (product && product.variants?.length) {
              for (const variant of product.variants) {
                await discountService.applyVariantDiscount(productId, variant._id, {
                  type: discountBody.type,
                  value: discountBody.value,
                  startDate: discountBody.startDate,
                  endDate: discountBody.endDate
                });
              }
            }
          }
        }
        break;

      case 'category':
        if (discountBody.conditions?.categories?.length) {
          for (const category of discountBody.conditions.categories) {
            await discountService.applyCategoryDiscount(category, {
              type: discountBody.type,
              value: discountBody.value,
              startDate: discountBody.startDate,
              endDate: discountBody.endDate
            });
          }
        }
        break;

      case 'all':
        // Apply to all products
        await discountService.applyCategoryDiscount(null, {
          type: discountBody.type,
          value: discountBody.value,
          startDate: discountBody.startDate,
          endDate: discountBody.endDate
        });
        break;
    }

    return discount;
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

  getAllDiscounts: async () => {
    const discounts = await Discount.find();
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

    // Check if active status is being updated
    if (updateBody.active !== undefined) {
      await discountService.updateDiscountStatus(discountId, updateBody.active);
    }

    // Check if other discount details have changed
    const hasDiscountDetailsChanged = 
      updateBody.type !== undefined ||
      updateBody.value !== undefined ||
      updateBody.startDate !== undefined ||
      updateBody.endDate !== undefined;

    // Update the discount document
    Object.assign(discount, updateBody);
    await discount.save();

    // If discount details changed, update all applied discounts
    if (hasDiscountDetailsChanged) {
      const discountData = {
        type: discount.type,
        value: discount.value,
        startDate: discount.startDate,
        endDate: discount.endDate
      };

      switch (discount.applicableTo) {
        case 'product':
          if (discount.conditions?.products?.length) {
            for (const productId of discount.conditions.products) {
              await discountService.applyProductDiscount(productId, discountData);
            }
          }
          break;

        case 'variant':
          if (discount.conditions?.products?.length) {
            for (const productId of discount.conditions.products) {
              const product = await Product.findById(productId);
              if (product && product.variants?.length) {
                for (const variant of product.variants) {
                  await discountService.applyVariantDiscount(
                    productId,
                    variant._id,
                    discountData
                  );
                }
              }
            }
          }
          break;

        case 'category':
          if (discount.conditions?.categories?.length) {
            for (const category of discount.conditions.categories) {
              await discountService.applyCategoryDiscount(category, discountData);
            }
          }
          break;

        case 'all':
          await discountService.applyCategoryDiscount(null, discountData);
          break;
      }
    }

    return discount;
  },

  deleteDiscount: async (discountId) => {
    const discount = await Discount.findById(discountId);
    if (!discount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
    }

    // Remove discounts from products based on applicableTo value
    switch (discount.applicableTo) {
      case 'product':
        if (discount.conditions?.products?.length) {
          for (const productId of discount.conditions.products) {
            const product = await Product.findById(productId);
            if (product) {
              product.discount = null;
              await product.save();
            }
          }
        }
        break;

      case 'variant':
        if (discount.conditions?.products?.length) {
          for (const productId of discount.conditions.products) {
            const product = await Product.findById(productId);
            if (product && product.variants?.length) {
              for (const variant of product.variants) {
                variant.discount = null;
              }
              await product.save();
            }
          }
        }
        break;

      case 'category':
        if (discount.conditions?.categories?.length) {
          for (const category of discount.conditions.categories) {
            await Product.updateMany(
              { category },
              { $set: { discount: null } }
            );
          }
        }
        break;

      case 'all':
        await Product.updateMany(
          {},
          { $set: { discount: null } }
        );
        break;
    }

    // Delete the discount document
    await discount.remove();
    return discount;
  },

  updateDiscountStatus: async (discountId, active) => {
      const discount = await Discount.findById(discountId);
      if (!discount) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
      }
  
      // Update discount status
      discount.active = active;
      await discount.save();
  
      // Update all products/variants with this discount
      switch (discount.applicableTo) {
        case 'product':
          if (discount.conditions?.products?.length) {
            for (const productId of discount.conditions.products) {
              const product = await Product.findById(productId);
              if (product?.discount) {
                product.discount.active = active;
                await product.save();
              }
            }
          }
          break;
  
        case 'variant':
          if (discount.conditions?.products?.length) {
            for (const productId of discount.conditions.products) {
              const product = await Product.findById(productId);
              if (product?.variants?.length) {
                for (const variant of product.variants) {
                  if (variant.discount) {
                    variant.discount.active = active;
                  }
                }
                await product.save();
              }
            }
          }
          break;
  
        case 'category':
          if (discount.conditions?.categories?.length) {
            for (const category of discount.conditions.categories) {
              await Product.updateMany(
                { category },
                {
                  $set: {
                    'discount.active': active
                  }
                }
              );
            }
          }
          break;
  
        case 'all':
          await Product.updateMany(
            { 'discount': { $exists: true } },
            {
              $set: {
                'discount.active': active
              }
            }
          );
          break;
      }
  
      return discount;
    },
};

// Helper function to generate unique discount code
const generateDiscountCode = () => {
  const prefix = 'DISC';
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomString}`;
};

module.exports = discountService;