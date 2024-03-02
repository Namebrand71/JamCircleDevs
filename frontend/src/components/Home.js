// HomePage.js
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";
import Leaderboard from "./LeaderBoard";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const HomePage = () => {
  const [listeningHistory, setListeningHistory] = useState([]);
  const [reviews, setReviewsComments] = useState([]);  // New state for recent comments
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
          // Fetch listening history
          const historyResponse = await fetch(`/api/all-listening-history/${encodeURIComponent(profileData.id)}`);
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            setListeningHistory(historyData);
          } else {
            console.error("Failed to fetch listening history");
          }

          // Fetch recent comments
          const commentsResponse = await fetch(`/api/all-review-history/${encodeURIComponent(profileData.id)}`);
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

  const displayedHistory = showAll ? listeningHistory : listeningHistory.slice(0, 10);

  return (
    <Grid
      container
      spacing={1}
      columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
    >
      {/* Your existing code */}

      <Grid item xs={4} sm={4} md={8} lg={16} xl={16} style={{ marginLeft: "280px" }}>
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

      {/* Display recent comments */}
      <Grid item xs={4} sm={4} md={8} lg={16} xl={16} style={{ marginLeft: "280px" }}>
        <br />
        <h2>Recent Comments</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Author:</strong> {review.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Rating:</strong> {review.rating}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Posted on:</strong>{" "}
                {new Date(review.posted_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">{review.text}</Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="h6">No reviews yet.</Typography>
        )}
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
          {/* Leaderboard */}
          <Leaderboard />
        </Grid>
      )}
    </Grid>
  );
};

export default HomePage;
