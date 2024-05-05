const UserService = require("../services/UserService");
const TransactionService = require("../services/TransactionService");
const { customAlphabet } = require("nanoid");
const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/helper");

const createUser = async (req, res) => {
  if (req.body.email) {
    const user = await UserService.findOneUser({ email: req.body.email });

    if (user) {
      return res.status(httpStatus.CONFLICT).send({ msg: "requested email already taken" });
    } else {
      const nanoid = customAlphabet("1234567890", 16);
      const uniqueAccountNumber = nanoid();
      req.body.accountNumber = parseInt(uniqueAccountNumber);
      req.body.password = passwordToHash(req.body.password);
      UserService.createUser(req.body)
        .then((response) => {
          res.status(httpStatus.CREATED).send(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};

const index = (req, res) => {
  if (req.params.id) {
    UserService.listUser({ _id: req.params.id })
      .then((response) => {
        if (response.length == 0) {
          res.status(httpStatus.NOT_FOUND).send({ msg: "No user found with this id" });
        } else {
          res.status(httpStatus.OK).send(response);
        }
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  } else {
    UserService.listUser()
      .then((response) => {
        if (response) {
          res.status(httpStatus.OK).send(response);
        }
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  UserService.findOneUser(req.body)
    .then((response) => {
      if (response == null) {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "user not found" });
      } else {
        user = {
          ...response.toObject(),
          tokens: {
            acces_token: generateAccessToken(response),
            refresh_token: generateRefreshToken(response),
          },
        };
        delete user.password;
        return res.status(httpStatus.OK).send(user);
      }
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = async (req, res) => {
  if (req.body.email) {
    const existedUser = await UserService.findOneUser({ email: req.body.email });
    if (existedUser) {
      return res.status(httpStatus.CONFLICT).send({ msg: "requested email already taken" });
    } else {
      UserService.updateUser({ _id: req.user?._id }, req.body)
        .then((updatedUser) => {
          return res.status(httpStatus.OK).send(updatedUser);
        })
        .catch((error) => {
          console.log(error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "Update güncelleme işlemi sırasında bir problem oluştu",
          });
        });
    }
  }
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);

  UserService.updateUserById({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      return res.status(httpStatus.OK).send({ msg: "password successfully updated!" });
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Update güncelleme işlemi sırasında bir problem oluştu" });
    });
};

const getBalance = async (req, res) => {
  try {
    const balance = await UserService.findUserBalance({ _id: req.user?._id });

    if (balance) {
      return res.status(httpStatus.OK).send(balance);
    } else {
      return res.status(httpStatus.NOT_FOUND).send({ msg: "balance couldn't found!" });
    }
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "There was a problem while fetching the balance data." });
  }
};

const userAllTransactionList = (req, res) => {
  try {
    TransactionService.listUserAllTransaction({ userId: req.user?._id }).then((response) => {
      if (response.length != 0) {
        return res.status(httpStatus.OK).send({ transactions: response });
      } else {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "No user transactions found" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error });
  }
};
const userReceiverTransactionList = (req, res) => {
  try {
    TransactionService.listUserReceiverTransaction({ receiver: req.user?._id }).then((response) => {
      if (response.length != 0) {
        return res.status(httpStatus.OK).send({ transactions: response });
      } else {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "No user transactions found" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error });
  }
};
const userSenderTransactionList = (req, res) => {
  try {
    TransactionService.listUserSenderTransaction({ sender: req.user?._id }).then((response) => {
      if (response.length != 0) {
        return res.status(httpStatus.OK).send({ transactions: response });
      } else {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "No user transactions found" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error });
  }
};

module.exports = {
  index,
  createUser,
  login,
  update,
  changePassword,
  getBalance,
  userAllTransactionList,
  userReceiverTransactionList,
  userSenderTransactionList,
};
