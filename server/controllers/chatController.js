const Chat = require("../models/Chat");
const generateAIResponse = require("../utils/aiService");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (message.length > 4000) {
      return res.status(400).json({ message: "Message too long (max 4000 characters)" });
    }

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

    // Only send the last 20 messages to keep requests small and fast
    const aiMessages = chat.messages.filter((msg) => msg.type !== "image").slice(-20).map((msg) => ({
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

// Image generation uses the free Pollinations endpoint (no API key needed).
// The browser loads the image directly from the URL we return.
const generateImage = async (req, res) => {
  try {
    const prompt = (req.body.prompt || "").trim();

    if (!prompt) {
      return res.status(400).json({ message: "Image prompt cannot be empty" });
    }

    if (prompt.length > 500) {
      return res.status(400).json({ message: "Prompt too long (max 500 characters)" });
    }

    const seed = Math.floor(Math.random() * 1000000);

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?width=768&height=768&seed=${seed}&nologo=true&model=flux`;

    let chat = await Chat.findOne({ userId: req.user.id });

    if (!chat) {
      chat = await Chat.create({ userId: req.user.id, messages: [] });
    }

    chat.messages.push({ role: "user", content: prompt, type: "image" });
    chat.messages.push({ role: "assistant", content: imageUrl, type: "image" });

    await chat.save();

    res.json({ imageUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const clearChat = async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { userId: req.user.id },
      { messages: [] }
    );

    res.json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getChat,
  clearChat,
  generateImage,
};