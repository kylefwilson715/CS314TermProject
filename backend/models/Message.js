const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String }, // For private messages
  groupId: { type: String }, // ✅ NEW: For group messages
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;

