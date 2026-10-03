const Chat = require("../models/Chat");
const generateAIResponse = require("../utils/aiService");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    let chat = await Chat.findOne({
      userId: req.user.id,
    });

    if (!chat) {
      chat = await Chat.create({
        userId: req.user.id,
        messages: [],
      });
    }

    chat.messages.push({
      role: "user",
      content: message,
    });

    const aiMessages = chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const aiResponse = await generateAIResponse(aiMessages);

    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    await chat.save();

    res.json({
      response: aiResponse,
    });
  } catch (error) {
    console.log("CHAT ERROR");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getChat = async (req, res) => {
  try {
    let chat = await Chat.findOne({
      userId: req.user.id,
    });

    if (!chat) {
      chat = await Chat.create({
        userId: req.user.id,
        messages: [],
      });
    }

    res.json(chat);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getChat,
};