import React, { useEffect, useState } from "react";
import socket from "../socket";

const DirectMessages = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recipient, setRecipient] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // ✅ Fetch all users for DM selection
    fetch("http://localhost:5001/api/auth/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("❌ Error fetching users:", err));
  }, []);

  useEffect(() => {
    socket.on("receiveDirectMessage", (message) => {
      console.log("📩 Received DM:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveDirectMessage");
  }, []);

  const sendDirectMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !user || !recipient) return;

    const messageData = {
      token: localStorage.getItem("token"),
      sender: user.username,
      recipient,
      content: input,
    };

    console.log("🚀 Sending DM:", messageData);
    socket.emit("sendDirectMessage", messageData);
    setInput("");
  };

  return (
    <div className="direct-messages">
      <h2>Direct Messaging</h2>
      <p>Welcome, {user?.username || "Guest"}!</p>

      <label>Select Recipient:</label>
      <select onChange={(e) => setRecipient(e.target.value)}>
        <option value="">-- Choose User --</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.username} ({u.email})
          </option>
        ))}
      </select>

      <div className="chat-box">
        {messages
          .filter((msg) => msg.recipient === recipient || msg.sender === recipient)
          .map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
      </div>

      <form onSubmit={sendDirectMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default DirectMessages;

