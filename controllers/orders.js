const Order = require("../models/Order");
const Item = require("../models/Item");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getOrdersByUser = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const orders = await Order.find({
    buyerId: userId,
  });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res) => {
  const {
    user: { userId },
    body: { itemIdList },
  } = req;
  const items = await Item.find({ _id: { $in: itemIdList } });
  if (!items) {
    throw new NotFoundError(
      "Fail to place order as we cannot find corresponding items."
    );
  }
  let totalAmount = 0;
  for (const item of items) {
    if (item.sellerId == userId) {
      throw new BadRequestError("You cannot buy things that you posted");
    }
    totalAmount += item.price;
  }
  // console.log(totalAmount);
  const order = await Order.create({
    buyerId: userId,
    itemIds: itemIdList,
    totalAmount: totalAmount,
  });
  res.status(StatusCodes.CREATED).json({ order });
};

module.exports = {
  getOrdersByUser,
  createOrder,
};
