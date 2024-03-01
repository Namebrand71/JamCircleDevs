import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import SearchBar from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const [listeningHistory, setListeningHistory] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [spotifyUsername, setSpotifyUsername] = useState("Loading...");
  const [currentSpotifyId, setCurrentSpotifyId] = useState(undefined);
  const { accessToken } = useAuth();
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    // Fetch listening history when the component mounts
    if (isAuthenticated) {
      fetch("/api/all-listening-history/${encodeURIComponent(spotify_id)}")
        .then((response) => response.json())
        .then((data) => {
          setListeningHistory(data); // Assuming the data is an array of listening history objects
        })
        .catch((error) => console.error("Error:", error));
    }

    if (isAuthenticated) {
      fetch("/auth/profile/")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSpotifyUsername(data.display_name);
          setCurrentSpotifyId(data.id);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          setSpotifyUsername("Loading...");
        });
    }
  }, [isAuthenticated]);

  const displayedHistory = showAll ? listeningHistory : listeningHistory.slice(0, 10);

  return (
    <Grid
      container
      spacing={1}
      columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
    >
      <Grid item xs={4} sm={3} md={3} lg={3} xl={3} align="right">
        {/* <Navbar /> */}
      </Grid>

      <Grid
        item
        xs={4}
        sm={4}
        md={8}
        lg={16}
        xl={16}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 style={{ fontSize: "3rem" }}>
            {isAuthenticated ? `Welcome ${spotifyUsername}` : "Please log in to view history"}
          </h1>
        </div>
        <SearchBar onSearch={() => {}} />
      </Grid>

      {isAuthenticated && (
        <Grid
          item
          xs={4}
          sm={4}
          md={8}
          lg={16}
          xl={16}
          style={{ marginLeft: "280px" }}
        >
          {/* Render listening history */}

          <br />
          <h2>Activity</h2>
          {displayedHistory.map((track, index) => (
            <Link
              to={`/song/${track.track_id}`}
              key={index}
              style={{ textDecoration: "none" }}
            >
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <img
                  src={track.user_profile_image}
                  style={{ borderRadius: "50%" }}
                  alt="Profile"
                />

                <p style={{ marginLeft: "10px", color: "white" }}>
                  {`${index + 1}. ${track.track_name} by ${track.artist_names}`}
                  <br />
                  {new Date(track.played_at).toLocaleString()}
                </p>
                {/* Additional track details */}
              </div>
            </Link>
          ))}

          {listeningHistory.length > 10 && !showAll && (
            <p
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setShowAll(true)}
            >
              Show more
            </p>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default HomePage;
