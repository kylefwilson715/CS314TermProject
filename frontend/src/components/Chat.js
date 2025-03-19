import React, { useState, useEffect } from "react";
import { sendMessage, getMessages } from "../services/api";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Fetch messages when the component loads
    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getMessages();
            setMessages(data);
        };
        fetchMessages();
    }, []);

    // Handle message send
    const handleSend = async () => {
        if (!newMessage.trim()) return;
        const messageData = await sendMessage(newMessage);
        if (messageData) {
            setMessages([...messages, messageData]); // Add new message
            setNewMessage(""); // Clear input
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h2>Chat</h2>
            <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <p key={index}>{msg.message}</p>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ width: "100%", padding: "10px", marginTop: "10px" }}
            />
            <button onClick={handleSend} style={{ width: "100%", marginTop: "10px", padding: "10px" }}>
                Send
            </button>
        </div>
    );
};

export default Chat;

