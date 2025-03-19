import styles from './styles/UserSettings.module.css';

import { useState, useEffect } from 'react';
import axios from 'axios';

function UserSettings() {
const [userData, setUserData] = useState({ username: '', email: '' });
const [error, setError] = useState('');

useEffect(() => {
    const fetchUserData = async () => {
    try {
        const response = await axios.get('http://localhost:5001/api/users/67da43a57d24044bcbc3d59c');
        setUserData(response.data);
    } catch (err) {
        setError('Failed to fetch user data');
    }
    };

    fetchUserData();
}, []);
return (
    <div className={styles.container}>
    <h1>User Settings</h1>
    <div className={styles.field}>
        <label>Username:</label>
        <input type="text" value={userData.username} readOnly />
    </div>
    <div className={styles.field}>
        <label>Email:</label>
        <input type="email" value={userData.email} readOnly />
    </div>
    {error && <p className={styles.error}>{error}</p>}
    </div>
);
}

export default UserSettings;

