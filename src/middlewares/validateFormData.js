const Joi = require("joi");
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { parseNestedObject } = require("../utils/transform");

const validateFormData = (schema) => (req, res, next) => {
  console.log("PARSED DATA", parseNestedObject(req.body));
  const validSchema = pick(schema, ["params", "query", "body"]);
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate({
      body: parseNestedObject(req.body),
    });

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validateFormData;
