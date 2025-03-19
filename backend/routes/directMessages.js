const express = require("express");
const DirectMessage = require("../models/DirectMessage");

const router = express.Router();

// ✅ Get all direct messages between two users
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await DirectMessage.find({
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

module.exports = router;

