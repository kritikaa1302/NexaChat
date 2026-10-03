const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getChat,
} = require("../controllers/chatController");

router.get(
  "/",
  authMiddleware,
  getChat
);

router.post(
  "/",
  authMiddleware,
  sendMessage
);

module.exports = router;