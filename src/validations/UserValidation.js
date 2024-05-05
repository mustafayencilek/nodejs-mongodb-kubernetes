const Joi = require("joi");

const createValidation = Joi.object({
  name: Joi.string().required().min(3),
  surname: Joi.string().required().min(3),
  password: Joi.string().required().min(8),
  email: Joi.string().email().required(),
});

const loginValidation = Joi.object({
  password: Joi.string().required().min(8),
  email: Joi.string().email().required().min(8),
});

const changePasswordValidation = Joi.object({
  password: Joi.string().required().min(8),
});

const updateValidation = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  createValidation,
  loginValidation,
  resetPasswordValidation,
  updateValidation,
  changePasswordValidation,
};
