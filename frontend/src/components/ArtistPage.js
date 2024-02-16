import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Grid from "@mui/material/Grid";
import Reviews from "./Reviews";

const ArtistPage = () => {
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
          setArtistInfo(data); // Assuming data is the object with the track details
        } else {
          console.error("Failed to fetch song data");
          setArtistInfo(null);
        }
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    // Call the function
    callDjangoAPI();
  }, [spotify_content_id]);

  return (
    <div className="artistpage">
      <Grid
        container
        spacing={1}
        alignItems={"flex-start"}
        style={{ marginLeft: "220px" }}
      >
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>
        {artistInfo ? (
          <>
            <Grid item xs={6} align="center">
              {/* Ensure you have a valid path to the image URL here */}
              <img
                src={artistInfo.images[0].url}
                width="350px"
                alt="Track Cover"
                style={{ paddingTop: "64px" }}
              />
              <h1>{artistInfo.name}</h1>
            </Grid>
            <Grid item xs={6} align="center">
              <Reviews spotifyContentId={spotify_content_id} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12} align="center">
            <h1>Loading artist info...</h1>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ArtistPage;
