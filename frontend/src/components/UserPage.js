import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Navbar from "./NavBar";
import TopTenTracks from "./TopTenTracks";
import TopTenArtists from "./TopTenArtists";
import Playlists from "./Playlists";

const UserPage = () => {
  const { spotify_id } = useParams();
  console.log(spotify_id);
  const [UserInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const callDjangoAPI = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/user/get_user_info/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ spotify_id: spotify_id }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data); // Assuming data is the object with the track details
        } else {
          console.error("Failed to fetch song data");
          setUserInfo(null);
        }
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    // Call the function
    callDjangoAPI();
  }, [spotify_id]);

  return (
    <div className="userpage">
      <Grid container spacing={1} alignItems={"flex-start"}>
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>
        <Grid item xs={1} align="center" style={{ paddingLeft: "28px" }}>
          <img
            src={UserInfo.images[0]}
            width="80px"
            className="ProfilePicture"
          />
        </Grid>
        <Grid item xs={11} style={{ paddingLeft: "28px" }}>
          <h1>
            {isAuthenticated ? UserInfo.display_name : "Not Logged in"}
          </h1>
        </Grid>
        {isAuthenticated && (
          <>
            <Grid
              item
              xs={6}
              style={{ paddingLeft: "28px", paddingRight: "28px" }}
            >
              <TopTenTracks />
            </Grid>
            <Grid
              item
              xs={6}
              style={{ paddingLeft: "28px", paddingRight: "28px" }}
            >
              <TopTenArtists />
            </Grid>
            <Grid item xs={12}>
              <Playlists />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default UserPage;
