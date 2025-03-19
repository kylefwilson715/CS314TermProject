// src/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Group = require("../models/Group");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// ✅ Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, username }, SECRET_KEY, { expiresIn: "2d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, username, email },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: "2d" });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch all users (for group creation, etc.)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username email");
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get user details
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, "username email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update user details
router.put("/update/:userId", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let updateData = { username, email };

    // If password is being updated, hash it first
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete user account
router.delete("/delete/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Remove user from groups
    const removeFromGroups = await Group.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );
    console.log("User removed from groups:", removeFromGroups);

    // Delete groups where user was the only member
    const deleteGroups = await Group.deleteMany({ members: { $size: 1, $in: [userId] } });
    console.log("Deleted groups where user was the only member:", deleteGroups);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

