// ChatBox.js
import React, { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ChatBox = () => {
    const { messages, setMessages } = useContext(ChatContext);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = async () => {
        if (newMessage.trim() === "") return;

        const messageData = { text: newMessage, sender: "You" };

        // Send message to backend
        const response = await fetch("http://localhost:5000/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageData),
        });

        if (response.ok) {
            const savedMessage = await response.json();
            setMessages([...messages, savedMessage]);
            setNewMessage("");
        }
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatBox;


