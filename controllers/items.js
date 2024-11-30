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
    body,
    params: { itemId },
    user: { userId },
  } = req;

  const item = await Item.findById(itemId);
  if (!item) {
    throw new NotFoundError(`No item with id ${itemId}`);
  }

  if (item.sellerId.toString() !== userId) {
    throw new BadRequestError(
        "You don't have rights to update this item as you're NOT the seller."
    );
  }

  const updatedItem = await Item.findByIdAndUpdate(itemId, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedItem) {
    throw new NotFoundError(`Failed to update item with id ${itemId}`);
  }

  res.status(StatusCodes.OK).json({ item: updatedItem });
};

const deleteItem = async (req, res) => {
  const {
    params: { itemId },
    user: { userId },
  } = req;

  const item = await Item.findById(itemId);
  if (!item) {
    throw new NotFoundError(`No item with id ${itemId}`);
  }

  if (item.sellerId.toString() !== userId) {
    throw new BadRequestError(
        "You don't have rights to delete this item as you're NOT the seller."
    );
  }

  await item.remove();

  res.status(StatusCodes.OK).send("Item deleted successfully");
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
