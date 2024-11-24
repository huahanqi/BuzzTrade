const Message = require("../models/Message");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllMessage = async (req, res) => {
  const {
    user: { userId },
    params: { receiverId },
  } = req;
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: receiverId },
      { senderId: receiverId, receiverId: userId },
    ],
  });
  res.status(StatusCodes.OK).json({ messages, count: messages.length });
};

const insertMessage = async (req, res) => {
  const {
    user: { userId },
    body: { receiverId },
  } = req;
  const user2 = await User.findOne({ _id: receiverId });
  if (!user2) {
    throw new NotFoundError(
      `You are trying to send messages to nonexisting user with id ${receiverId}`
    );
  }
  if (receiverId == userId) {
    throw new BadRequestError("You cannot send message to yourself");
  }
  const message = await Message.create({ ...req.body, senderId: userId });
  res.status(StatusCodes.CREATED).json({ message });
};

module.exports = {
  getAllMessage,
  insertMessage,
};
