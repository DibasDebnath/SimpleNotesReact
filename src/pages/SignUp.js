import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext); // Access signup function from context
  // const URL = "http://localhost:4000";
  const URL = "https://simplenotesbackend.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Basic Validation
      if (!formData.username || !formData.email || !formData.password) {
        setError("Please fill in all fields.");
        return;
      }

      const response = await axios.post(
        URL+"/api/auth/register",
        formData
      );

      const { token } = response.data;

      if (token) {
        signup(token); // Call signup function from context to update global auth state
        console.log("Signed up successfully");
        navigate("/"); // Redirect to home page or dashboard
      }
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred"); // Handle API error messages
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>Sign Up</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Display Name"
            required
            maxLength={20}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="signin-link">
          <button onClick={() => navigate("/signin")}>
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
