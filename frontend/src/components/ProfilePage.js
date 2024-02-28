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
  const [friendRequests, setFriendRequests] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const { accessToken } = useAuth();
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
      fetchFriendRequests();
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

  // Add a method to toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => ({
      isDropdownVisible: !prevState.isDropdownVisible,
    }));
  };

  // Add a method to fetch friend requests
  const fetchFriendRequests = async () => {
    try {
      const response = await fetch("/users/get-user-pending-friends/");
      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleAcceptRequest = async (friendRequest) => {
    const spotify_id = friendRequest?.from_user__spotify_id;

    // Ensure spotify_id is not undefined before making the fetch
    if (spotify_id) {
      try {
        await fetch(`/users/accept-friend-request/${spotify_id}`);
        // After accepting the request, fetch updated friend requests
        fetchFriendRequests();
      } catch (error) {
        console.error("Error accepting friend request:", error);
      }
    } else {
      console.error("Invalid friend request data:", friendRequest);
    }
  };

  const handleRejectRequest = async (friendRequest) => {
    const spotify_id = friendRequest?.from_user__display_name;
    try {
      await fetch(`/users/reject-friend-request/${spotify_id}`);
      // After rejecting the request, fetch updated friend requests
      fetchFriendRequests();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
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

              <SearchBar onSearch={handleSearch} />
            </Grid>

            {/* Button to toggle the dropdown */}
            <Grid item xs={12} style={{ paddingLeft: "28px" }}>
              {/* Add the "Friends" button */}
              <Link
                to={`/friends/${currentSpotifyId}`}
                style={{ paddingRight: "10px" }}
              >
                <Button variant="contained">Friends</Button>
              </Link>
              <Button variant="contained" onClick={toggleDropdown}>
                Show Friend Requests
              </Button>
              {isDropdownVisible && (
                <div style={{ marginTop: "16px" }}>
                  {/* Display friend requests in the dropdown */}
                  {friendRequests.map((request) => (
                    <div
                      key={request.from_user__display_name}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "8px",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>
                        <Link to={`/user/${request.from_user__spotify_id}`}>
                          {request.from_user__display_name}
                        </Link>
                      </Typography>
                      <Button onClick={() => handleAcceptRequest(request)}>
                        Accept
                      </Button>
                      <Button onClick={() => handleRejectRequest(request)}>
                        Reject
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
