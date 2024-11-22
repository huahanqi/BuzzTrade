const express = require("express");

const router = express.Router();
const { getAllMessage, insertMessage } = require("../controllers/messages");

router.route("/").get(getAllMessage).post(insertMessage);

module.exports = router;
