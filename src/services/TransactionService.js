const TransactionModel = require("../models/TransactionModel");

const sendMoney = (data) => {
  return new TransactionModel({
    sender: data.newSender,
    receiver: data.newReceiver,
    senderAccountNumber: data.senderAccountNumber,
    receiverAccountNumber: data.receiverAccountNumber,
    amount: data.amount,
  }).save();
};
const listUserAllTransaction = ({ userId }) => {
  return TransactionModel.find({ $or: [{ sender: userId }, { receiver: userId }] })
    .populate({
      path: "sender",
      select: "name surname amount",
    })
    .populate({
      path: "receiver",
      select: "name surname amount",
    });
};
const listUserSenderTransaction = (where) => {
  return TransactionModel.find(where)
    .populate({
      path: "sender",
      select: "name surname amount",
    })
    .populate({
      path: "receiver",
      select: "name surname amount",
    });
};
const listUserReceiverTransaction = (where) => {
  return TransactionModel.find(where)
    .populate({
      path: "sender",
      select: "name surname amount",
    })
    .populate({
      path: "receiver",
      select: "name surname amount",
    });
};

module.exports = {
  sendMoney,
  listUserAllTransaction,
  listUserSenderTransaction,
  listUserReceiverTransaction,
};
