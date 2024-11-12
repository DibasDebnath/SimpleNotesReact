import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { authToken, logout, user } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for popup visibility
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/"); // Redirect to the home page after logout
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true); // Show the confirmation popup
  };

  const closePopup = () => {
    setShowLogoutConfirm(false); // Close the confirmation popup without logging out
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
          <button className="button" onClick={handleLogoutClick}>
            Logout
          </button>
        )}
      </div>

      {/* Confirmation popup */}
      {showLogoutConfirm && (
        <div className="logout-popup">
          <div className="popup-content">
            <p>Are you sure you want to log out?</p>
            <div className="popup-buttons">
              <button className="button" onClick={handleLogout}>
                Yes
              </button>
              <button className="button" onClick={closePopup}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
