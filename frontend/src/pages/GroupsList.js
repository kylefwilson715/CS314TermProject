// GroupsList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GroupsList = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log("🔍 Fetching groups for user:", userId);
        const response = await axios.get(`http://localhost:5001/api/groups/user/${userId}`);
        console.log("✅ Groups fetched:", response.data);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        console.error("Request URL:", `http://localhost:5001/api/groups/user/${userId}`);
      }
    };

    if (userId) {
      fetchGroups();
    } else {
      console.error("User ID is undefined");
    }
  }, [userId]);

  const handleGroupClick = (groupId) => {
    console.log("📌 Navigating to group chat:", groupId);
    navigate(`/group/${groupId}`);
  };

  return (
    <div>
      <h2>My Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group._id} onClick={() => handleGroupClick(group._id)}>
              {group.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupsList;
