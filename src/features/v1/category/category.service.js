const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const Category = require("./category.model");
const Product = require("../product/product.model");
const mongoose = require("mongoose");

const categoryService = {
  createCategory: async (categoryBody) => {
    if (await Category.findOne({ slug: categoryBody.slug })) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Slug already exists");
    }
    return Category.create(categoryBody);
  },

  getAllCategories: async () => {
    const categories = await Category.find();
    return categories;
  },

  getCategories: async (filter, options) => {
    const categories = await Category.paginate(filter, options);
    return categories;
  },

  getCategoryById: async (id) => {
    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    return category;
  },

  getCategoryBySlug: async (slug) => {
    const category = await Category.findOne({ slug });
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    return category;
  },

  getSubcategories: async (parentId) => {
    return Category.find({ parent: parentId, status: "active" });
  },

  updateCategoryById: async (categoryId, updateBody) => {
    // check if category exists
    const category = await Category.findById(categoryId);
    // console.log("MAIN CATEGORY", category);
    // if category not found, throw error
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    // check if category name already exists
    const categoryExistWithSameName = await Category.findOne({
      name: updateBody.name,
    });

    // if category exist with same name, throw error
    if (categoryExistWithSameName._id.toString() !== categoryId.toString()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Category with updated name already exist"
      );
    }
    // if (
    //   updateBody.slug &&
    //   (await Category.findOne({
    //     slug: updateBody.slug,
    //     _id: { $ne: categoryId },
    //   }))
    // ) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, "Slug already exists");
    // }
    // update category
    Object.assign(category, updateBody);
    await category.save();
    return category;
  },

  deleteCategoryById: async (categoryId) => {
    const category = await Category.findById(categoryId);
    // check if there is a product with the category, if so suggest editing and not deleting
    const isProductHaveCategory = await Product.findOne({
      category: mongoose.Types.ObjectId(categoryId),
    });

    if (isProductHaveCategory) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot delete category as product exist under category, Instead Edit"
      );
    }
    const hasSubcategories = await Category.exists({ parent: categoryId });
    if (hasSubcategories) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot delete category with subcategories"
      );
    }
    await category.remove();
    return category;
  },

  getFeaturedCategories: async () => {
    return Category.find({ featured: true, status: "active" }).sort({
      order: 1,
    });
  },
};

module.exports = categoryService;
