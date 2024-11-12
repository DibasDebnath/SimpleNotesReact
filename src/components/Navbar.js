import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Navbar.css";

const Navbar = () => {
  const { authToken, logout,user } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLogout = () => {
    logout(); // Call logout to update global state
    navigate("/"); // Redirect to the home page after logout
  };

  var homeTag = "Home";

  if (user) {
    let { username } = user;
    homeTag = username;
  }

    return (
      <nav className="nav">
        <div className="center">
          <button className="button" onClick={() => navigate("/")}>
            {homeTag}
          </button>
        </div>
        <div className="right">
          {authToken && (
            <button className="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    );
};

export default Navbar;
