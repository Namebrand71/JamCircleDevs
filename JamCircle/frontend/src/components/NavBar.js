import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/auth/is-authenticated/")
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleAuthButtonClick = () => {
    if (isAuthenticated) {
      fetch("/auth/logout/")
        .then((response) => response.json())
        .then((data) => {
          setIsAuthenticated(false);
          window.location.reload();
        })
        .catch((error) => console.error("Error:", error));
    } else {
      fetch("/auth/authSpotify")
        .then((response) => response.json())
        .then((data) => {
          window.location.href = data.url;
        })
        .catch((error) => console.error("Error:", error));

      // navigate("/auth/authSpotify"); // Redirect to Spotify authentication
    }
  };

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
      <button onClick={handleAuthButtonClick}>
        {isAuthenticated ? "Click to Logout" : "Click to Login"}
      </button>
    </nav>
  );
};

export default Navbar;
