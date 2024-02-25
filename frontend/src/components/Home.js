import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import SearchBar from "./SearchBar";

const HomePage = () => {
  const [listeningHistory, setListeningHistory] = useState([]);

  useEffect(() => {
    // Fetch listening history when the component mounts
    fetch("/api/all-listening-history/")
      .then((response) => response.json())
      .then((data) => {
        setListeningHistory(data); // Assuming the data is an array of listening history objects
      })
      .catch((error) => console.error("Error:", error));
  }, []);

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
          <h1>Home</h1>
        </div>
        <SearchBar onSearch={() => {}} />
      </Grid>
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
        {listeningHistory.map((track, index) => (
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
                {track.track_name} by {track.artist_names}
              </p>
              {/* Additional track details */}
            </div>
          </Link>
        ))}
      </Grid>
    </Grid>
  );
};

export default HomePage;
