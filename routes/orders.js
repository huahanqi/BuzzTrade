const express = require("express");

const router = express.Router();
const { createOrder, getOrdersByUser } = require("../controllers/orders");

router.route("/").get(getOrdersByUser).post(createOrder);

module.exports = router;
