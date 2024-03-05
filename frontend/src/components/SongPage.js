import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, Button, Box, Paper } from '@mui/material';
import Reviews from "./Reviews";

const SongPage = ({ onPlay }) => {
  const { spotify_content_id } = useParams();
  const [trackInfo, setTrackInfo] = useState(null);

  useEffect(() => {
    const callDjangoAPI = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/reviews/get_track_info/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ spotify_content_id: spotify_content_id }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTrackInfo(data); // Assuming data is the object with the track details
        } else {
          console.error("Failed to fetch song data");
          setTrackInfo(null);
        }
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    // Call the function
    callDjangoAPI();
  }, [spotify_content_id]);

  return (
    <div className="songpage" style={{ backgroundColor: "#121212", color: "#fff" }}>
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ padding: '20px' }}>
      {/* Optionally include Navbar grid item here */}

      {/* Songcard grid item */}
      <Grid item xs={12} sm={8} md={6} lg={5}>
        {trackInfo ? (
          <Paper elevation={3} style={{ padding: '20px', backgroundColor: "#181818", color: "#fff" }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img
                src={trackInfo.album.images[0].url}
                width="100%"
                alt="Track Cover"
                style={{ maxWidth: "350px", paddingBottom: "20px" }}
              />
              <Typography variant="h5" gutterBottom>
                {trackInfo.name} - {trackInfo.artists[0].name}
              </Typography>
              <Typography variant="subtitle1">
                {Math.floor(trackInfo.duration_ms / 60000)}:{("0" + ((trackInfo.duration_ms % 60000) / 1000).toFixed(0)).slice(-2)}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => onPlay(spotify_content_id, "track")} style={{ marginTop: '20px' }}>
                Play Song
              </Button>
            </Box>
          </Paper>
        ) : (
          <Typography variant="h6">Loading track info...</Typography>
        )}
      </Grid>

      {/* Reviews grid item */}
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Reviews spotifyContentId={spotify_content_id} />
      </Grid>
    </Grid>
  </div>
  );
};

export default SongPage;
