import axios from 'axios';

const API_URL = "http://localhost:5001"; // Backend URL

export const sendMessage = async (message) => {
    try {
        const response = await axios.post(`${API_URL}/messages`, { message });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        return null;
    }
};

export const getMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}/messages`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

