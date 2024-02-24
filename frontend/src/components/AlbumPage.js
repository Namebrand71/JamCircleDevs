import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
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
    <div className="songpage">
      <Grid container spacing={1}>
        {/* Navbar grid item */}
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
          {/* <Navbar /> */}
        </Grid>
        <Grid item xs={6} sm={6} md={5} lg={5} xl={5}>
          <button onClick={() => onPlay(spotify_content_id, "album")}>
            Play
          </button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SongPage;
