import React, { Component, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { TextField } from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import TopTenTracks from "./TopTenTracks";
import TopTenArtists from "./TopTenArtists";
import Playlists from "./Playlists";
import SearchBar from "./SearchBar";
import handleSearch from "./NavBar";
import { useAuth } from "../contexts/AuthContext";
import Stats from "./Stats";

const ProfilePage = () => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     spotifyUsername: "Loading...",
  //     currentSpotifyId: "undefinded",
  //     profileImageUrl: "https://fakeimg.pl/750x750?text=Loading&font=noto",
  //     isAuthenticated: false,
  //     friendRequests: [],
  //     isDropdownVisible: false,
  //   };
  // }
  const [spotifyUsername, setSpotifyUsername] = useState("Loading...");
  const [currentSpotifyId, setCurrentSpotifyId] = useState(undefined);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://fakeimg.pl/750x750?text=Loading&font=noto"
  );

  const { accessToken } = useAuth();
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const loadProfile = () => {
    fetch("/auth/profile/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSpotifyUsername(data.display_name);
        setProfileImageUrl(
          data.images && data.images.length > 1
            ? data.images[1].url
            : `https://ui-avatars.com/api/?name=${data.display_name[0]}&background=2A2A2A&color=FFFFFF&size=200`
        );
        setCurrentSpotifyId(data.id);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setSpotifyUsername("Failed to load...");
      });
  };

  return (
    <div className="profilepage">
      <Grid
        container
        spacing={1}
        columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
      >
        {/* Navbar Grid item */}
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
          {/* <Navbar /> */}
        </Grid>

        {/* Content Grid item */}
        <Grid item xs={4} sm={4} md={8} lg={16} xl={16}>
          <Grid container spacing={1} alignItems="flex-start">
            {/* Profile Picture and Username */}
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "28px",
                marginTop: "10px",
                borderBottom: "2px solid #2a2a2a",
              }}
            >
              {/* Profile Picture and Username */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={profileImageUrl}
                  width="150px"
                  height="150px"
                  className="ProfilePicture"
                />
                <h1 style={{ marginLeft: "40px", fontSize: "3rem" }}>
                  {isAuthenticated ? spotifyUsername : "Not Logged in"}
                </h1>
              </div>

             <Stats/>
            </Grid>

            {/* Conditional rendering if authenticated */}
            {isAuthenticated && (
              <>
                <Grid
                  item
                  xs={12}
                  style={{
                    paddingLeft: "28px",
                    paddingRight: "28px",
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr",
                    columnGap: "16px",
                  }}
                >
                  <TopTenTracks />
                  <TopTenArtists />
                </Grid>
                <Grid item xs={12}>
                  <Playlists />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfilePage;
