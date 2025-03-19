const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");

const router = express.Router();

// ✅ Get all messages for a specific group
router.get("/group/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const messages = await Message.find({ groupId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching group messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all messages between two users (Direct Messages)
router.get("/dm/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching direct messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Send a message (Save to DB)
router.post("/", async (req, res) => {
  try {
    const { sender, content, recipient, groupId } = req.body;

    if (groupId && !mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const newMessage = new Message({ sender, content, recipient, groupId });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

