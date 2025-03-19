import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      // Check if the response contains a token and user data
      if (response.data.token && response.data.user) {
        // Save token and user info to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log("Navigating to home page...");
        // Redirect to the main app page
        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login Error:", err.response || err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate("/register")}>Create Account</button>
    </div>
  );
};

export default Login;
