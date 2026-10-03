const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getChat,
  clearChat,
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

router.delete(
  "/",
  authMiddleware,
  clearChat
);

module.exports = router;