import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "30px",
        backgroundColor: "#333",
        color: "white",
        padding: "0 20px", // Add padding on both sides for spacing
      }}
    >
      <div style={{ fontSize: "24px" }}>Jam Circle</div>
      <div>
        <Link
          to="/"
          style={{
            marginRight: "10px",
            marginLeft: "10px",
            color: "white",
            textDecoration: "none",
          }}
        >
          Home
        </Link>
        <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
