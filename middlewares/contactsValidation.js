const Joi = require("joi");
const { ValidationError } = require("../helpers/errors");

module.exports = {
  newContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(15).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      phone: Joi.string().min(9).max(15).required(),
      favorite: Joi.boolean().optional(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      next(new ValidationError(JSON.stringify(validationResult.error.details)));
    }

    next();
  },

  updatedContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(15).optional(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .optional(),
      phone: Joi.string().min(9).max(15).optional(),
      favorite: Joi.boolean().optional(),
    }).min(1);

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      next(new ValidationError(JSON.stringify(validationResult.error.details)));
    }

    next();
  },
  updateStatusContactValidation: (req, res, next) => {
    const schema = Joi.object({
      favorite: Joi.boolean().required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      next(
        new ValidationError(
          "missing field favorite (boolean) or body includes more then 1 key"
        )
      );
    }

    next();
  },
};