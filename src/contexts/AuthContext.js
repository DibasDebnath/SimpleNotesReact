import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
// const URL = "http://localhost:4000";
const URL = "https://simplenotesbackend.onrender.com";

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || null
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authToken) {
      const fetchUser = async () => {
        try {
          const response = await fetch(URL+"/api/auth", {
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
  }, [authToken]);

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
    localStorage.setItem("authToken", token);
    setAuthToken(token);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
