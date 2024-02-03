import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Grid from "@mui/material/Grid";

const SongPage = () => {
  const { spotify_content_id } = useParams();

  useEffect(() => {
    // Your componentDidMount logic here
  }, []); // Empty dependency array to mimic componentDidMount

  return (
    <div className="songpage">
      <Grid container spacing={1} alignItems={"flex-start"}>
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>
        <Grid item xs={12} align="center">
          <p>Spotify Content ID: {spotify_content_id}</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default SongPage;
