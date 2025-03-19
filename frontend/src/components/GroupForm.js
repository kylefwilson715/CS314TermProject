import React from 'react';

import { useState } from 'react';

const GroupForm = () => {
const [groupName, setGroupName] = useState('');
const [usernames, setUsernames] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to call backend API with groupName and usernames
};
return (
    <div>
    <form onSubmit={handleSubmit}>
    <label>
        Group Name:
        <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} required />
    </label>
    <label>
        Usernames (comma-separated):
        <input type="text" value={usernames} onChange={e => setUsernames(e.target.value)} required />
    </label>
    <button type="submit">Create Group</button>
    </form>
    </div>
);
};

export default GroupForm;

