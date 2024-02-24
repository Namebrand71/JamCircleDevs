import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import PlayerWrapper from "./PlayerWrapper";

const Navbar = ({ spotifyContentId, spotifyContentType }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    songName: "",
    artistName: "",
    albumCoverImageUrl: "",
    trackID: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/auth/is-authenticated/")
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        if (data.isAuthenticated) {
          fetchCurrentlyPlayingSong();
        }
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
          window.location.href = "/";
        })
        .catch((error) => console.error("Error:", error));
    } else {
      fetch("/auth/authSpotify")
        .then((response) => response.json())
        .then((data) => {
          window.location.href = data.url;
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const fetchCurrentlyPlayingSong = () => {
    fetch("/auth/currently-playing/")
      .then((response) => response.json())
      .then((data) => {
        if (data.isPlaying) {
          setCurrentSong({
            songName: data.songName,
            artistName: data.artistNames,
            albumCoverImageUrl: data.albumCoverImageUrl,
            trackID: data.track_id,
          });
        } else {
          // Handle no song playing
          setCurrentSong({
            songName: "",
            artistName: "",
            albumCoverImageUrl: "",
            trackID: "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching currently playing song:", error);
      });
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const activeStyle = {
    color: "#ff0095", // Set the color for the active text
    backgroundColor: "black", // Set the background color for the active box
    width: "100%",
  };

  const linkStyle = {
    display: "block",
    color: "white", // default link color
    textDecoration: "none",
    padding: "20px",
    textAlign: "center",
    width: "100%", // Full width
    marginBottom: "0px", // Space between links
    // add other styles as needed
  };

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center", // Changed to center the children horizontally
        height: "100vh", // Full height of the viewport
        width: "220px", // Width of the sidebar
        position: "fixed", // Fixed position
        left: "0", // Align to the left side of the viewport
        top: "0", // Align to the top of the viewport
        backgroundColor: "#111111", // Background color of the sidebar
        color: "white",
        padding: "20px", // Padding inside the sidebar
        boxSizing: "border-box", // Ensures padding doesn't affect the set width
      }}
    >
      <div
        style={{
          fontSize: "24px",
          paddingBottom: "20px",
          textAlign: "center",
          width: "100%",
        }}
      >
        Jam Circle
      </div>
      {/* <SearchBar onSearch={handleSearch} /> */}
      <NavLink
        to="/"
        style={({ isActive }) => ({
          ...linkStyle, // spread the base styles
          ...(isActive ? activeStyle : {}), // spread the active styles if the link is active
        })}
      >
        Home
      </NavLink>

      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          ...linkStyle, // spread the base styles
          ...(isActive ? activeStyle : {}), // spread the active styles if the link is active
        })}
      >
        Profile
      </NavLink>
      {/* Add additional navigation links or content here */}
      <button
        onClick={handleAuthButtonClick}
        style={{
          backgroundColor: isAuthenticated ? "#D7504D" : "#5fa052",
          color: "white",
          padding: "10px 10px",
          border: "none",
          textTransform: "uppercase",
          marginTop: "20px",
          cursor: "pointer",
          width: "50%", // Use full width of the sidebar
        }}
        className="login-btn"
      >
        {isAuthenticated ? "Logout" : "Login"}
      </button>

      <PlayerWrapper
        spotifyContentId={spotifyContentId}
        spotifyContentType={spotifyContentType}
      />

      {isAuthenticated ? (
        currentSong.songName && currentSong.artistName ? (
          <div
            style={{
              marginTop: "auto",
              textAlign: "center",
              borderTop: "1px solid #fff",
            }}
          >
            <div style={{ marginTop: "20px" }}>Now Playing:</div>
            <Link
              to={`/song/${currentSong.trackID}`}
              style={{ textDecoration: "none" }}
            >
              <img
                src={currentSong.albumCoverImageUrl}
                alt="Album cover"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginTop: "20px",
                }}
              />
            </Link>
            <Link
              to={`/song/${currentSong.trackID}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <div>
                {currentSong.songName} - {currentSong.artistName}
              </div>
            </Link>
          </div>
        ) : (
          // This block renders when no song is currently playing
          <div
            style={{ marginTop: "auto", textAlign: "center", color: "white" }}
          >
            No song is currently playing.
          </div>
        )
      ) : (
        // This block can render when the user is not authenticated or as a fallback
        <div style={{ marginTop: "auto", textAlign: "center", color: "white" }}>
          Please log in to view the currently playing song.
        </div>
      )}
    </nav>
  );
};

export default Navbar;
