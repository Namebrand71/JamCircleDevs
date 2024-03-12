import React, { Component, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TopTenTracks from "./TopTenTracks";
import TopTenArtists from "./TopTenArtists";
import Playlists from "./Playlists";
import SearchBar from "./SearchBar";
import handleSearch from "./NavBar";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
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
    <Grid
      container
      spacing={1}
      columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
    >
      {/* Create space for Navbar on the left side */}
      <Grid item xs={4} sm={3} md={3} lg={4} xl={3}>
        {/* <Navbar /> */}
      </Grid>

      {/* Content Grid item */}
      <Grid item xs={4} sm={4} md={8} lg={15} xl={16}>
        {/* Profile picture and username */}
        <Grid container spacing={1} alignItems="flex-start">
          {/* Spaces out profile picture/username with the search bar */}
          <Grid item xs={12} marginTop={"20px"} className="ProfilePage">
            {/* Profile Picture and Username */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Display profile picture */}
              <img
                src={profileImageUrl}
                width="150px"
                height="150px"
                alt="Profile"
              />
              {/* Display username */}
              <h1>{isAuthenticated ? spotifyUsername : "Not Logged in"}</h1>
            </div>

            {/* Display searchbar */}
            <SearchBar onSearch={handleSearch} />
          </Grid>

          {/* Conditional rendering if authenticated */}
          {isAuthenticated && (
            <>
              {/* Page content */}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                {/* Display top 10 tracks */}
                <TopTenTracks />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                {/* Display top 10 artists */}
                <TopTenArtists />
              </Grid>

              {/* Display playlists */}
              <Grid item xs={12}>
                <Playlists />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
