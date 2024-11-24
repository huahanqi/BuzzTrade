const express = require("express");

const router = express.Router();
const { getAllMessage, insertMessage } = require("../controllers/messages");

router.route("/").post(insertMessage);
router.route("/:receiverId").get(getAllMessage);

module.exports = router;
