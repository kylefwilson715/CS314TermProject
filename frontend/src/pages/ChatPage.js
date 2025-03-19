// ChatPage.js
import React from "react";
import ChatBox from "../components/ChatBox";
import "../App.css";

const ChatPage = () => {
    return (
        <div className="chat-page">
            <h2>Chat Application</h2>
            <ChatBox />
        </div>
    );
};

export default ChatPage;

