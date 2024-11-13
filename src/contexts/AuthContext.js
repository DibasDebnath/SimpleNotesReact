import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode correctly

const AuthContext = createContext();
//const URL = "http://localhost:4000";
const URL = "https://simplenotesbackend.onrender.com";

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || null
  );
  const [user, setUser] = useState(null);

  // Decode token to get its expiration date
  const getTokenExpiration = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp ? decoded.exp * 1000 : null; // Convert to ms
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  // Check if token is close to expiry
  const isTokenExpiringSoon = useCallback((token) => {
    const expiration = getTokenExpiration(token);
    if (!expiration) return false;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return expiration - Date.now() < sevenDaysInMs;
  }, []);

  const renewToken = useCallback(async () => {
    try {
      const response = await fetch(URL + "/api/auth/renew", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        login(newToken);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error renewing token:", error.message);
      logout();
    }
  }, [authToken]); // Ensure `authToken` is a dependency here

  useEffect(() => {
    if (authToken) {
      const fetchUser = async () => {
        try {
          if (isTokenExpiringSoon(authToken)) {
            await renewToken(); // Renew if close to expiration
          }
          const response = await fetch(URL + "/api/auth", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (!response.ok) {
            logout();
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUser(data); // Set user info
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      };
      fetchUser();
    }
  }, [authToken, isTokenExpiringSoon, renewToken]); // Include dependencies here

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
  };

  const signup = (token) => {
    login(token);
  };

  // Function to delete all notes of the user
  const deleteAllNotes = async () => {
    try {
      const response = await fetch(URL + "/api/notes/deleteAllNotesForUser", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        console.log("All notes deleted successfully");
      } else {
        console.error("Failed to delete all notes");
      }
    } catch (error) {
      console.error("Error deleting all notes:", error.message);
    }
  };

  // Function to delete the user account
  const deleteUser = async () => {
    try {
      const response = await fetch(URL + "/api/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        console.log("User deleted successfully");
        logout(); // Log the user out after deletion
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        user,
        setUser,
        login,
        logout,
        signup,
        deleteAllNotes,
        deleteUser,
        URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
