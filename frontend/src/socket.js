import { io } from "socket.io-client";

// Connect to the backend WebSocket server
const socket = io("http://localhost:5001", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket! ID:", socket.id);
});

socket.on("receiveMessage", (message) => {
  console.log("📩 New message received:", message);
});

export default socket;

