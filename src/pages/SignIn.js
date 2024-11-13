import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const navigate = useNavigate();
  const { login, URL } = useContext(AuthContext);
  // const URL = "http://localhost:4000";
  //const URL = "https://simplenotesbackend.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSigningIn(true);

    try {
      const response = await axios.post(URL + "/api/auth/login", formData);
      const token = response.data.token;

      login(token);

      console.log("Logged in successfully");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
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
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="reveal-password-btn"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            className="signin-form-btn"
            type="submit"
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>
        </form>

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
