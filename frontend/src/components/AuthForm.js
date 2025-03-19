import React, { useState } from "react";

const AuthForm = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isLogin: false, // Toggle between login and register
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formData.isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>{formData.isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {!formData.isLogin && (
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        )}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">{formData.isLogin ? "Login" : "Register"}</button>
      </form>
      <button onClick={() => setFormData({ ...formData, isLogin: !formData.isLogin })}>
        {formData.isLogin ? "Switch to Register" : "Switch to Login"}
      </button>
    </div>
  );
};

export default AuthForm;

