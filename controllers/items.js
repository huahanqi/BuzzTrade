const Item = require("../models/Item");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllItem = async (req, res) => {
  const items = await Item.find();
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getAllItemByCategory = async (req, res) => {
  const {
    params: { category },
  } = req;
  const items = await Item.find({ category: category });
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getAllItemByKeyword = async (req, res) => {
  const {
    params: { keyword },
  } = req;
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Create a regex pattern with word boundaries
  const regex = new RegExp(`\\b${escapedKeyword}\\b`, "i");
  const items = await Item.find({ description: { $regex: regex } });
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getAllItemByUser = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const items = await Item.find({ sellerId: userId });
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getItem = async (req, res) => {
  const {
    params: { itemId },
  } = req;

  const item = await Item.findOne({
    _id: itemId,
  });
  if (!item) {
    throw new NotFoundError(`No item with id ${itemId}`);
  }
  res.status(StatusCodes.OK).json({ item });
};

const createItem = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const item = await Item.create({
    ...req.body,
    sellerId: userId,
    status: "available",
  });
  res.status(StatusCodes.CREATED).json({ item });
};

const updateItem = async (req, res) => {
  const {
    body: { name, price, description, category, condition },
    params: { itemId },
    user: { userId },
  } = req;

  if (item.sellerId != userId) {
    throw new BadRequestError(
      "You don't have rights to update this item as you're NOT the seller."
    );
  }
  const item = await Item.findByIdAndUpdate(itemId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    throw new NotFoundError(`No item with id ${itemId}`);
  }
  res.status(StatusCodes.OK).json({ item });
};

const deleteItem = async (req, res) => {
  const {
    params: { itemId },
    user: { userId },
  } = req;

  if (item.sellerId != userId) {
    throw new BadRequestError(
      "You don't have rights to delete this item as you're NOT the seller."
    );
  }

  const item = await Item.findByIdAndRemove({
    _id: itemId,
  });
  if (!item) {
    throw new NotFoundError(`No item with id ${itemId}`);
  }

  res.status(StatusCodes.OK).send("delete successfully");
};

module.exports = {
  getAllItem,
  getAllItemByCategory,
  getAllItemByUser,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getAllItemByKeyword,
};
