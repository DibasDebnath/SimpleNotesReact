import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
  const { logout, user } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown menu
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsDropdownOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate("/");
    setShowLogoutConfirm(false);
  };

  const closeLogoutConfirm = () => setShowLogoutConfirm(false);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button className="profile-icon" onClick={toggleDropdown}>
        {/* Profile Icon or Initial */}
        {user?.username?.charAt(0).toUpperCase() || "P"}
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <button onClick={handleProfileClick}>Profile</button>
          <button onClick={handleLogoutClick}>Log Out</button>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="logout-popup">
          <div className="popup-content">
            <p>Are you sure you want to log out?</p>
            <div className="popup-buttons">
              <button className="button" onClick={handleLogoutConfirm}>
                Yes
              </button>
              <button className="button" onClick={closeLogoutConfirm}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
