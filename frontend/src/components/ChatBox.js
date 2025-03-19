// ChatBox.js
import React, { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ChatBox = () => {
    const { messages, setMessages } = useContext(ChatContext);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = () => {
        if (newMessage.trim() === "") return;

        // Add new message to state (later replace with backend API call)
        setMessages([...messages, { text: newMessage, sender: "You" }]);
        setNewMessage("");
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

