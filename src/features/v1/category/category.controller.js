const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const categoryService = require("./category.service");
const { uploadImage } = require("../storage/cloudinary.service");

const categoryController = {
  createCategory: catchAsync(async (req, res) => {
    const upload = await uploadImage(req.files["imageFile"].tempFilePath);

    if (!upload) {
      throw new ApiError(httpStatus[503], "Image Upload Down");
    }

    const category = await categoryService.createCategory({
      ...req.body,
      image: upload.secure_url,
    });

    res.status(httpStatus.CREATED).send(category);
  }),

  getAllCategories: catchAsync(async (req, res) => {
    const category = await categoryService.getAllCategories();
    res.status(httpStatus.CREATED).send(category);
  }),

  getCategories: catchAsync(async (req, res) => {
    const filter = req.query;
    const options = req.query;
    const result = await categoryService.getCategories(filter, options);
    res.send(result);
  }),

  getCategory: catchAsync(async (req, res) => {
    const category = await categoryService.getCategoryById(
      req.params.categoryId
    );
    res.send(category);
  }),

  getCategoryBySlug: catchAsync(async (req, res) => {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    res.send(category);
  }),

  getSubcategories: catchAsync(async (req, res) => {
    const subcategories = await categoryService.getSubcategories(
      req.params.categoryId
    );
    res.send(subcategories);
  }),

  updateCategory: catchAsync(async (req, res) => {
    // if no image file, update category without image
    if (!req.files["imageFile"]) {
      const category = await categoryService.updateCategoryById(
        req.params.categoryId,
        req.body
      );
      res.send(category);
      return;
    }
    // if image file, update category with image
    const upload = await uploadImage(req.files["imageFile"].tempFilePath);

    if (!upload) {
      throw new ApiError(httpStatus[503], "Image Upload Down");
    }

    const category = await categoryService.updateCategoryById(
      req.params.categoryId,
      { ...req.body, image: upload.secure_url }
    );
    res.send(category);
  }),

  deleteCategory: catchAsync(async (req, res) => {
    await categoryService.deleteCategoryById(req.params.categoryId);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  getFeaturedCategories: catchAsync(async (req, res) => {
    const categories = await categoryService.getFeaturedCategories();
    res.send(categories);
  }),
};

module.exports = categoryController;
