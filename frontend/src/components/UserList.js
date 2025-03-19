import React from 'react';

import { useEffect, useState } from 'react';

const UserList = () => {
const [users, setUsers] = useState([]);

useEffect(() => {
    // Logic to fetch users from backend API
}, []);
return (
    <div>
    <ul>
    {users.map(user => (
        <li key={user.id}>{user.username}</li>
    ))}
    </ul>
    </div>
);
};

export default UserList;

