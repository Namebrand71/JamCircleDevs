import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, Button, Box, Paper } from "@mui/material";
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
          setTrackInfo(data);
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
    <div className="songpage">
      <Grid container spacing={1}>
        {/* Navbar grid item */}
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
          {/* <Navbar /> */}
        </Grid>

        {/* Songcard grid item */}
        <Grid item xs={6} sm={6} md={5} lg={5} xl={5}>
          {trackInfo ? (
            <div align="center" className="songcard">
              {/* Album cover */}
              <img src={trackInfo.album.images[0].url} alt="Track Cover" />
              <h1>
                {/* Track name */}
                {trackInfo.name} - {trackInfo.artists[0].name}
              </h1>
              <h2>
                {/* Track duration */}
                {Math.floor(trackInfo.duration_ms / 60000)}:
                {(
                  "0" + ((trackInfo.duration_ms % 60000) / 1000).toFixed(0)
                ).slice(-2)}
              </h2>
              {/* Play the song */}
              <button onClick={() => onPlay(spotify_content_id, "track")}>
                Play Song
              </button>
            </div>
          ) : (
            <h1>Loading track info...</h1>
          )}
        </Grid>

        {/* Reviews grid item */}
        <Grid item xs={3} sm={3} md={5} lg={5} xl={5} align="center">
          <Reviews spotifyContentId={spotify_content_id} />
        </Grid>
      </Grid>
    </div>
  );
};

export default SongPage;
