import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access the login method from context
  // const URL = "http://localhost:4000";
  const URL = "https://simplenotesbackend.onrender.com";
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation before submitting the form
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(URL + "/api/auth/login", formData);

      const token = response.data.token;

      // Use the login function from context to update the authentication state
      login(token);

      console.log("Logged in successfully");
      navigate("/"); // Redirect to home or dashboard
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      setError(errorMessage);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup"); // Redirect to SignUp page
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h1>Sign In</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Sign In</button>
        </form>

        {/* Sign-up link */}
        <div className="signup-link">
          <button onClick={handleSignUpRedirect}>
            Don’t have an account? Sign up here
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
