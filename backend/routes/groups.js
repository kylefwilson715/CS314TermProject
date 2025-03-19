const express = require("express");
const mongoose = require("mongoose");
const Group = require("../models/Group");
const User = require("../models/User");

const router = express.Router();

// ✅ Create a new group (Requires creator)
router.post("/create", async (req, res) => {
  try {
    const { name, members, creator } = req.body;

    console.log("📥 Received group creation request:", req.body);

    if (!mongoose.Types.ObjectId.isValid(creator)) {
      return res.status(400).json({ message: "Invalid creator ID format." });
    }

    if (!Array.isArray(members) || members.some(m => !mongoose.Types.ObjectId.isValid(m))) {
      return res.status(400).json({ message: "Invalid members format. Members must be valid MongoDB ObjectIds." });
    }

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group name already in use" });
    }

    const newGroup = new Group({ name, members, creator });
    await newGroup.save();

    console.log("✅ Group created successfully:", newGroup);
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("❌ Error creating group:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all groups for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userGroups = await Group.find({ members: userId }).populate("members", "username email");
    res.json(userGroups);
  } catch (error) {
    console.error("❌ Error fetching user groups:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get a specific group
router.get("/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const group = await Group.findById(groupId).populate("members", "username email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json(group);
  } catch (error) {
    console.error("❌ Error fetching group:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update group members (ONLY THE CREATOR CAN UPDATE)
router.put("/update/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, members } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid group or user ID format" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.creator.toString() !== userId) {
      return res.status(403).json({ message: "Only the group creator can update members." });
    }

    group.members = members;
    await group.save();

    res.json({ message: "Group updated successfully", group });
  } catch (error) {
    console.error("❌ Error updating group:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete group (ONLY THE CREATOR CAN DELETE)
router.delete("/delete/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body; // The user requesting deletion

    if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid group or user ID format" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.creator.toString() !== userId) {
      return res.status(403).json({ message: "Only the group creator can delete this group." });
    }

    await Group.findByIdAndDelete(groupId);
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting group:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Add a user to a group
router.post("/:groupId/add-user", async (req, res) => {
console.log("➡️  Add user to group request received:", { params: req.params, body: req.body });
try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.warn("⚠️  Invalid ID format:", { groupId, userId });
    return res.status(400).json({ message: "Invalid group or user ID format" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
    console.warn("⚠️  Group not found:", { groupId });
    return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(userId)) {
    console.warn("⚠️  User already a member of the group:", { groupId, userId });
    return res.status(400).json({ message: "User already a member of the group" });
    }

    group.members.push(userId);
    await group.save();

    res.json({ message: "User added to group successfully", group });
} catch (error) {
    console.error("❌ Error adding user to group:", { error, params: req.params, body: req.body });
    res.status(500).json({ message: "Server error", error: error.message });
}
});

module.exports = router;

