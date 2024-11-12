import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

// Pages & Components
import Home from "./pages/Home";
import NoteDetails from "./pages/NoteDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

function App() {
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const { authToken } = useContext(AuthContext); // Get authToken from AuthContext
    return authToken ? children : <Navigate to="/signin" />;
  };

  return (
    <div className="app-container">
      <HashRouter basename="/">
        <AuthProvider>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route
                path="/note/:id"
                element={
                  <ProtectedRoute>
                    <NoteDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </AuthProvider>
      </HashRouter>
    </div>
  );
}

export default App;
