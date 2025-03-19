import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateGroup = ({ userId }) => {
const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);
const [groupName, setGroupName] = useState("");
const [memberUsernames, setMemberUsernames] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");

    // Convert comma-separated usernames to an array
    const usernames = memberUsernames.split(",").map((username) => username.trim());

    if (!isValidObjectId(userId)) {
    setError("Invalid creator ID format.");
    return;
    }
      const response = await fetch("http://localhost:5001/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
        memberUsernames: [userId, ...usernames], // Include the creator in the group
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Group created:", data);
        navigate("/groups"); // Redirect to groups list
      } else {
        setError(data.message || "Failed to create group.");
      }
    } catch (error) {
      console.error("❌ Error creating group:", error);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div>
      <h2>Create a Group</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreateGroup}>
        <label>Group Name:</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />

        <label>Member Usernames (comma-separated):</label>
        <input
          type="text"
        value={memberUsernames}
        onChange={(e) => setMemberUsernames(e.target.value)}
        placeholder="Enter usernames, separated by commas"
        />

        <button type="submit">Create Group</button>
      </form>
      <button onClick={() => navigate("/groups")}>🔙 Back to Groups</button>
    </div>
  );
};

export default CreateGroup;

