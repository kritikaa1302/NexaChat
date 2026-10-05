const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    // "text" = normal chat, "image" = generated image (content holds the image URL)
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);