import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";

const Navbar = () => {
  const { authToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const homeTag = user ? user.username : "Home";

  return (
    <nav className="nav">
      <div className="center">
        <button className="button" onClick={() => navigate("/")}>
          {homeTag}
        </button>
      </div>
      <div className="right">
        {authToken && <ProfileDropdown />}{" "}
        {/* Display ProfileDropdown if authenticated */}
      </div>
    </nav>
  );
};

export default Navbar;
