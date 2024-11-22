const Message = require("../models/Message");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllMessage = async (req, res) => {
  const {
    user: { userId },
    body: { user2Id },
  } = req;
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: user2Id },
      { senderId: user2Id, receiverId: userId },
    ],
  });
  res.status(StatusCodes.OK).json({ messages, count: items.length });
};

const insertMessage = async (req, res) => {
  const message = await Message.create(req.body);
  res.status(StatusCodes.CREATED).json({ message });
};

module.exports = {
  getAllMessage,
  insertMessage,
};
