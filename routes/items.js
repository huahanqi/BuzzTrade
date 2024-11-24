const express = require("express");

const router = express.Router();
const {
  getAllItem,
  getAllItemByCategory,
  getAllItemByUser,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getAllItemByKeyword,
} = require("../controllers/items");

router.route("/").post(createItem).get(getAllItem);
router.route("/getByCategory/:category").get(getAllItemByCategory);
router.route("/getByUser").get(getAllItemByUser);
router.route("/getByKeyword/:keyword").get(getAllItemByKeyword);
// test resume from here
router.route("/:itemId").get(getItem).delete(deleteItem).patch(updateItem);

module.exports = router;
