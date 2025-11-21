const Joi = require("joi");
const { objectId } = require("../../../validations/custom.validation");

const categoryValidation = {
  createCategory: {
    body: Joi.object().keys({
      name: Joi.string().required(),
      slug: Joi.string().required(),
      description: Joi.string(),
      parent: Joi.string().custom(objectId).optional(),
      imageFile: Joi.array().items(Joi.any().meta({ swaggerType: "file" })),
      status: Joi.string().valid("active", "inactive"),
      featured: Joi.boolean(),
      metaTitle: Joi.string().optional(),
      metaDescription: Joi.string().optional(),
      order: Joi.number(),
    }),
  },

  getCategories: {
    query: Joi.object().keys({
      name: Joi.string(),
      status: Joi.string(),
      featured: Joi.boolean(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  },

  getCategory: {
    params: Joi.object().keys({
      categoryId: Joi.string().custom(objectId).required(),
    }),
  },

  getCategoryBySlug: {
    params: Joi.object().keys({
      slug: Joi.string().required(),
    }),
  },

  getSubcategories: {
    params: Joi.object().keys({
      categoryId: Joi.string().custom(objectId).required(),
    }),
  },

  updateCategory: {
    params: Joi.object().keys({
      categoryId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object()
      .keys({
        name: Joi.string(),
        slug: Joi.string(),
        description: Joi.string(),
        parent: Joi.string().custom(objectId).optional(),
        imageFile: Joi.array()
          .items(Joi.any().meta({ swaggerType: "file" }))
          .optional(),
        status: Joi.string().valid("active", "inactive"),
        featured: Joi.boolean(),
        metaTitle: Joi.string(),
        metaDescription: Joi.string(),
        order: Joi.number(),
      })
      .min(1),
  },

  deleteCategory: {
    params: Joi.object().keys({
      categoryId: Joi.string().custom(objectId).required(),
    }),
  },
};

module.exports = categoryValidation;
