import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { authToken, user, setUser, URL, setAuthToken } =
    useContext(AuthContext); // Access the user and authToken from AuthContext
  const [username, setUsername] = useState(user.username || ""); // Initialize username from user data
  const [isUpdating, setIsUpdating] = useState(false);
  const [usernameError, setUsernameError] = useState(""); // Separate error for username update
  const [passwordError, setPasswordError] = useState(""); // Separate error for password update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(""); // Success message for password update
  const [usernameSuccessMessage, setUsernameSuccessMessage] = useState(""); // Success message for username update
  const [deleteError, setDeleteError] = useState(""); // Error message for delete profile
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState(""); // Success message for delete profile
  const [deletePassword, setDeletePassword] = useState(""); // State for password input when deleting profile
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signin"); // Redirect to SignIn if no user is found
    }
  }, [user, navigate]);

  // Handle username change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle current password change for delete action
  const handleDeletePasswordChange = (e) => {
    setDeletePassword(e.target.value);
  };

  // Handle current password change for password update
  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  // Handle new password change
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Handle updating the username
  const handleUpdate = async () => {
    if (!username) {
      setUsernameError("Username cannot be empty.");
      return;
    }

    setIsUpdating(true);
    setUsernameError(""); // Clear any previous error

    try {
      const response = await axios.patch(
        `${URL}/api/auth/update-username`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setUser({ ...user, username: response.data.user.username }); // Update user in context with new username
      setIsUpdating(false);
      setUsernameSuccessMessage("Username updated successfully."); // Set success message for username
      setUsernameError(""); // Clear error if update is successful
    } catch (error) {
      setIsUpdating(false);
      setUsernameError(
        error.response?.data?.error || "Failed to update username."
      );
      setUsernameSuccessMessage(""); // Clear success message if error occurs
    }
  };

  // Handle updating the password
  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setIsPasswordUpdating(true);
    setPasswordError(""); // Clear any previous error

    try {
      await axios.patch(
        `${URL}/api/auth/update-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Reset the password input fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setIsPasswordUpdating(false);
      setPasswordSuccessMessage("Password updated successfully."); // Set success message for password
      setPasswordError(""); // Clear error if password update is successful
    } catch (error) {
      setIsPasswordUpdating(false);
      setPasswordError(
        error.response?.data?.error || "Failed to update password."
      );
      setPasswordSuccessMessage(""); // Clear success message if error occurs
    }
  };

  // Disable the update password button if the fields are not filled or passwords don't match
  const isPasswordValid =
    newPassword && confirmPassword && newPassword === confirmPassword;

  const handleDeleteProfile = async () => {
    closePopup();
    if (!deletePassword) {
      setDeleteError(
        "Please enter your current password to delete the profile."
      );
      return;
    }

    setDeleteError(""); // Clear previous errors
    setDeleteSuccessMessage(""); // Clear previous success message

    try {
      // Step 1: Send current password to delete all notes
      await axios.delete(`${URL}/api/notes/deleteAllNotesForUser`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: { password: deletePassword },
      });

      // Step 2: Delete the user profile
      await axios.delete(`${URL}/api/auth/delete`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: { password: deletePassword },
      });

      // Step 3: Clear user session and navigate home
      setAuthToken(null); // Clear auth token
      setUser(null); // Clear user context
      navigate("/"); // Redirect to home page
      setDeleteSuccessMessage("Profile deleted successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete profile.";
      setDeleteError(errorMessage); // Set error message if any step fails
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true); // Show the delete confirmation popup
  };

  const closePopup = () => {
    setShowDeleteConfirm(false); // Close the popup without deleting
  };


  return (
    <div className="profile-container">
      <div className="profile-form">
        <p className="email">Email - {user.email}</p>
        <h1>Display Name</h1>

        <div className="profile-input-container">
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Display Name"
            maxLength="20"
            required
          />
          <button
            className="update-btn"
            onClick={handleUpdate}
            disabled={isUpdating || username === user.username} // Disable if updating or no change in username
          >
            {isUpdating ? "Updating..." : "Update Display Name"}
          </button>
        </div>
        {/* Username update section */}
        {usernameError && <p className="error-message">{usernameError}</p>}
        {usernameSuccessMessage && (
          <p className="success-message">{usernameSuccessMessage}</p>
        )}

        <div className="password-update-container">
          <h1>Password</h1>

          <div className="password-input-container">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              placeholder="Current Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="reveal-password-btn"
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="password-input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="New Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="reveal-password-btn"
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm New Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="reveal-password-btn"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            className="update-btn"
            onClick={handlePasswordUpdate}
            disabled={isPasswordUpdating || !isPasswordValid} // Disable if passwords don't match
          >
            {isPasswordUpdating ? "Updating..." : "Update Password"}
          </button>
        </div>

        {/* Password update section */}
        {passwordError && <p className="error-message">{passwordError}</p>}
        {passwordSuccessMessage && (
          <p className="success-message">{passwordSuccessMessage}</p>
        )}

        {/* Delete Profile section */}
        <h2 className="delete-profile">Delete Profile</h2>
        <div className="password-input-container">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={deletePassword}
            onChange={handleDeletePasswordChange}
            placeholder="Current Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="reveal-password-btn"
          >
            {showCurrentPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="delete-profile-container">
          <button className="delete-btn" onClick={confirmDelete}>
            Delete Profile
          </button>
          {deleteError && <p className="error-message">{deleteError}</p>}
          {deleteSuccessMessage && (
            <p className="success-message">{deleteSuccessMessage}</p>
          )}
        </div>
      </div>

      {/* Delete confirmation popup */}
      {showDeleteConfirm && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete your profile FOREVER?</p>
            <div className="popup-buttons">
              <button className="button" onClick={handleDeleteProfile}>
                Yes
              </button>
              <button className="button" onClick={closePopup}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
