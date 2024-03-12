import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";
import Leaderboard from "./LeaderBoard";

const HomePage = () => {
  const [listeningHistory, setListeningHistory] = useState([]);
  const [reviews, setReviewsComments] = useState([]); // New state for recent comments
  const [showAll, setShowAll] = useState(false);
  const [spotifyUsername, setSpotifyUsername] = useState("Loading...");
  const [currentSpotifyId, setCurrentSpotifyId] = useState(undefined);
  const { accessToken } = useAuth();
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch("/auth/profile/");
        if (!profileResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const profileData = await profileResponse.json();
        setSpotifyUsername(profileData.display_name);
        setCurrentSpotifyId(profileData.id);

        if (isAuthenticated) {
          const historyResponse = await fetch(
            `/api/all-listening-history/${encodeURIComponent(profileData.id)}`
          );
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            setListeningHistory(historyData);
          } else {
            console.error("Failed to fetch listening history");
          }

          // Fetch recent comments
          const commentsResponse = await fetch(
            `/api/all-review-history/${encodeURIComponent(profileData.id)}`
          );
          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            setReviewsComments(commentsData);
          } else {
            console.error("Failed to fetch recent comments");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setSpotifyUsername("Loading...");
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const displayedHistory = showAll
    ? listeningHistory
    : listeningHistory.slice(0, 5);

  return (
    <Grid
      container
      spacing={4}
      columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
    >
      {/* Display banner */}
      <img src="../../../static/images/Banner.png" width="100%" />

      {/* Top bar */}
      <Grid item xs={20} sm={20} md={20} lg={20} xl={20} className="HomeTopBar">
        {/* Display usenname if authenticated */}
        <div id="Welcome">
          <h1>
            {isAuthenticated
              ? `Welcome ${spotifyUsername}`
              : "Please log in to view history"}
          </h1>
        </div>

        {/* Display search bar */}
        <div>
          <SearchBar onSearch={() => {}} />
        </div>
      </Grid>

      {/* Make space for the Navbar */}
      <Grid item xs={8} sm={6} md={3} lg={0} xl={0}>
        {/* <Navbar /> */}
      </Grid>

      {/* Display content if user is logged in */}
      {isAuthenticated && (
        <Grid item xs={4} sm={6} md={12} lg={12} xl={12}>
          {/* Display Leaderboard */}
          <h2>Leaderboard</h2>
          <Leaderboard />

          {/* Render listening history */}
          <div className="HomeContent">
            <h2>Recent Activity</h2>
            {displayedHistory.map((track, index) => (
              <Link to={`/song/${track.track_id}`} key={index}>
                <div id="Activities">
                  <img src={track.user_profile_image} alt="Profile" />

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span id="TrackName">{track.track_name}</span>
                    <span id="ArtistName">{track.artist_names}</span>
                  </div>
                </div>
                <div>
                  <p>{new Date(track.played_at).toLocaleString()}</p>
                </div>
              </Link>
            ))}

            {/* Expand recent activity */}
            {listeningHistory.length > 5 && !showAll && (
              <h3 onClick={() => setShowAll(true)}>Show more</h3>
            )}

            {/* Collapse recent activity */}
            {listeningHistory.length > 5 && showAll && (
              <h3 onClick={() => setShowAll(false)}>Show less</h3>
            )}
          </div>
        </Grid>
      )}
    </Grid>
  );
};

export default HomePage;
