require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/groups");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages"); // ✅ Ensure this is included

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes); // ✅ Ensure this is included

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ WebSocket Events
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("sendMessage", async ({ token, sender, content, recipient, groupId }) => {
    console.log("📩 Message received on server:", { sender, recipient, content, groupId });

    try {
      if (!token) {
        console.log("❌ Unauthorized: No token provided");
        return socket.emit("error", { message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
      if (!decoded) {
        console.log("❌ Unauthorized: Invalid token");
        return socket.emit("error", { message: "Unauthorized: Invalid token" });
      }

      console.log("🔑 Authenticated user:", decoded.username);

      // ✅ Save message to MongoDB
      const newMessage = new Message({ sender, recipient, content, groupId });
      await newMessage.save();

      console.log("💾 Message saved to DB:", newMessage);

      // ✅ Emit message to either private chat or group chat
      const messageToSend = {
        sender: newMessage.sender,
        content: newMessage.content,
        recipient: newMessage.recipient,
        groupId: newMessage.groupId,
      };

      if (groupId) {
        console.log(`📢 Broadcasting to group: ${groupId}`);
        io.to(groupId).emit("receiveMessage", messageToSend); // ✅ Broadcast to group
      } else {
        io.emit("receiveMessage", messageToSend); // ✅ Send to all users
      }

      console.log("🚀 Message sent via WebSocket:", messageToSend);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`📌 User ${socket.id} joined group: ${groupId}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ✅ Start Express Server (Must Be After WebSocket Setup)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

