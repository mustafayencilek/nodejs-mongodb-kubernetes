const express = require("express");
const {
  createUser,
  index,
  login,
  update,
  changePassword,
  getBalance,
  userAllTransactionList,
  userReceiverTransactionList,
  userSenderTransactionList,
} = require("../controllers/UserController");
const validate = require("../middlewares/validate");
const schemas = require("../validations/UserValidation");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get(index);
router.route("/transactions").get(authenticate, userAllTransactionList);
router.route("/balance").get(authenticate, getBalance);
router.route("/:id").get(index);
router.route("/transactions/sender").get(authenticate, userSenderTransactionList);
router.route("/transactions/receiver").get(authenticate, userReceiverTransactionList);
router.route("/").post(validate(schemas.createValidation), createUser);
router.route("/login").post(validate(schemas.loginValidation), login);
router
  .route("/change-password")
  .patch(validate(schemas.changePasswordValidation), authenticate, changePassword);
router.route("/").patch(validate(schemas.updateValidation), authenticate, update);

module.exports = { router };
