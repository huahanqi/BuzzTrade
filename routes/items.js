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

router
  .route("/")
  .post(createItem)
  .get(getAllItem)
  .get(getAllItemByCategory)
  .get(getAllItemByUser)
  .get(getAllItemByKeyword);

router.route("/:id").get(getItem).delete(deleteItem).patch(updateItem);

module.exports = router;
