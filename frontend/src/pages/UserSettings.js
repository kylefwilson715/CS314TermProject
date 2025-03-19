import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const UserSettings = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("🔍 Fetching user data for userId:", userId);
        const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
        console.log("✅ User data received:", response.data);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
        console.error("Request URL:", `http://localhost:5001/api/users/${userId}`);
        setError("Failed to fetch user data.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setLoading(false);
      setError("No user ID found.");
    }
  }, [userId]);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-settings">
      <h2>User Settings</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      {/* Add more user settings and update functionality as needed */}
    </div>
  );
};

export default UserSettings;
