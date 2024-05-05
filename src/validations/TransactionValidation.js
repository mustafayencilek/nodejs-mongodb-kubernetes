const Joi = require("joi");

const createTransactionValidation = Joi.object({
  receiver: Joi.string().required().min(16),
  amount: Joi.number().required().min(1),
});

module.exports = {
  createTransactionValidation,
};
