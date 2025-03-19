import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import socket from "./socket";
import GroupsList from "./pages/GroupsList";
import CreateGroup from "./pages/CreateGroup";
import UserSettings from "./pages/UserSettings";
import DirectMessages from "./pages/DirectMessages";
import GroupChat from "./pages/GroupChat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from './components/Navbar';
import Header from './components/Header';
import "./App.css";

window.socket = socket;

function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored User:", storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("User set from localStorage:", parsedUser);
    }
  }, []);

  const isAuthenticated = !!user;
  console.log("Is Authenticated:", isAuthenticated);

  return (
    <div className="App">
    <Header />
    {isAuthenticated && <Navbar />}
      {isAuthenticated && (
        <nav>
          <Link to="/">🏠 Home</Link>
          <Link to="/groups">📂 Manage Groups</Link>
          <Link to="/create-group">➕ Create Group</Link>
          <Link to="/direct-messages">💬 Direct Messages</Link>
          <Link to="/settings">⚙️ User Settings</Link>
        </nav>
      )}

      {/* ✅ Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="chat-container">
                <h1>Chat Application</h1>
                <p>Welcome, {user.username}!</p>
                <p>Select "Direct Messages" or "Manage Groups" to start chatting.</p>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/groups" element={isAuthenticated ? <GroupsList userId={user.id} /> : <Navigate to="/login" />} />
        <Route path="/create-group" element={isAuthenticated ? <CreateGroup userId={user.id} /> : <Navigate to="/login" />} />
        <Route path="/direct-messages" element={isAuthenticated ? <DirectMessages userId={user.id} /> : <Navigate to="/login" />} />
        <Route path="/group/:groupId" element={isAuthenticated ? <GroupChat userId={user.id} /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <UserSettings userId={user.id} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
