const UserService = require("../services/UserService");
const TransactionService = require("../services/TransactionService");
const httpStatus = require("http-status");
const { Mutex } = require("async-mutex");
const mutex = new Mutex();

const createTransaction = async (req, res) => {
  const release = await mutex.acquire();
  try {
    const sender = await UserService.findOneUser({ _id: req.user?._id });
    const receiver = await UserService.findOneUser({ accountNumber: req.body.receiver });

    if (sender != null && receiver != null && req.body.amount != null) {
      const { balance } = await UserService.findUserBalance({ accountNumber: sender.accountNumber });

      if (balance < req.body.amount) {
        return res.status(httpStatus.BAD_REQUEST).send({ msg: "Insufficient balance" });
      }
      sender.balance -= req.body.amount;
      receiver.balance += req.body.amount;
      const transaction = {
        newSender: sender._id,
        newReceiver: receiver._id,
        senderAccountNumber: sender.accountNumber,
        receiverAccountNumber: receiver.accountNumber,
        amount: req.body.amount,
      };

      await TransactionService.sendMoney(transaction);
      await UserService.updateUser({ _id: sender._id }, sender);
      await UserService.updateUser({ _id: receiver._id }, receiver);
      res.status(httpStatus.OK).send({ message: "Payment successful" });
    } else {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ msg: "The receiver's account number or the amount is missing" });
    }
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  } finally {
    release();
  }
};

module.exports = { createTransaction };
