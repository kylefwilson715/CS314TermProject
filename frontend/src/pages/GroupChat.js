import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

const GroupChat = ({ userId }) => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log("📌 Joined group:", groupId);
    socket.emit("joinGroup", groupId);

    socket.on("receiveMessage", (message) => {
      console.log("📩 Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [groupId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const token = localStorage.getItem("token");
      const messageData = {
        token,
        sender: "testing", // Replace with actual sender info
        content: input,
        groupId,
      };

      console.log("🚀 Sending group message:", messageData);
      socket.emit("sendMessage", messageData);
      setInput("");
    }
  };

  return (
    <div>
      <h2>Group Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
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

export default GroupChat;
