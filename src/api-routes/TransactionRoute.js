const express = require("express");
const { createTransaction } = require("../controllers/TransactionController");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const schemas = require("../validations/TransactionValidation");
const router = express.Router();

router.route("/").post(validate(schemas.createTransactionValidation), authenticate, createTransaction);
module.exports = { router };
