const Joi = require("joi");
const { ValidationError } = require("../helpers/errors");

module.exports = {
  userValidation: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return next(
        new ValidationError(JSON.stringify(validationResult.error.details))
      );
    }

    next();
  },
};