const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Add this field
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;

