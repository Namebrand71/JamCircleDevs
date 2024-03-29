import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Reviews from "./Reviews";

const ArtistPage = ({ onPlay }) => {
  const { spotify_content_id } = useParams();
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    const callDjangoAPI = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/reviews/get_artist_info/",
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
          setArtistInfo(data);
        } else {
          console.error("Failed to fetch song data");
          setArtistInfo(null);
        }
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    callDjangoAPI();
  }, [spotify_content_id]);

  return (
    <div className="songpage">
      <Grid container spacing={1}>
        {/* Navbar grid item */}
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
          {/* <Navbar /> */}
        </Grid>

        {/* Artistcard grid item */}
        <Grid item xs={6} sm={6} md={5} lg={5} xl={5}>
          {artistInfo ? (
            <div align="center" className="songcard">
              {/* Artist profile picture */}
              <img
                src={
                  artistInfo.images && artistInfo.images.length > 0
                    ? artistInfo.images[0].url
                    : ""
                }
                alt="Missing Artist Picture"
              />
              {/* Artist's name */}
              <h1>{artistInfo.name}</h1>
              {/* Play songs from artist button */}
              <button onClick={() => onPlay(spotify_content_id, "artist")}>
                Play
              </button>
            </div>
          ) : (
            <h1>Loading artist info...</h1>
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

export default ArtistPage;
