import React, { useEffect, useState } from "react";
import socket from "../socket";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      console.log(`🔗 Joining group: ${selectedGroup}`);
      socket.emit("joinGroup", selectedGroup);
    }
  }, [selectedGroup]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      console.log("📩 Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const messageData = {
      token: localStorage.getItem("token"),
      sender: user.username,
      content: input,
      groupId: selectedGroup,
    };

    console.log("🚀 Sending message:", messageData);
    socket.emit("sendMessage", messageData);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h1>Chat Application</h1>
      <p>Welcome, {user?.username || "Guest"}!</p>

      <div>
        <label>Select Group:</label>
        <select onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">-- Choose Group --</option>
          <option value="group1">Group 1</option>
          <option value="group2">Group 2</option>
        </select>
      </div>

      <div className="chat-box">
        {messages
          .filter((msg) => msg.groupId === selectedGroup)
          .map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
      </div>

      <form onSubmit={sendMessage} className="input-form">
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

export default Chat;

