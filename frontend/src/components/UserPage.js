import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Navbar from "./NavBar";
import TopTenUserTracks from "./TopTenUserTracks";
import TopTenUserArtists from "./TopTenUserArtists";
import UserPlaylists from "./UserPlaylists";

const SendFriendRequestButton = ({ spotify_id }) => {
  const handleSendFriendRequest = () => {
    // Implement logic to send friend request
    console.log(`Friend request sent to ${spotify_id}`);
    // You can use an API call or any other method to send a friend request
  };

  return (
    <button onClick={handleSendFriendRequest}>
      Send Friend Request
    </button>
  );
};

const UserPage = () => {
  const { spotify_id } = useParams();
  const [UserInfo, setUserInfo] = useState(null);
  const isAuthenticated = true; // TODO: implement an actual check

  useEffect(() => {
    const callDjangoAPI = async (spotify_id) => {
      try {
        const response = await fetch(`/users/get_user_info/${encodeURIComponent(spotify_id)}/`);

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data); // Assuming data is the object with the user details
        } else {
          console.error("Failed to fetch user data");
          setUserInfo(null);
        }
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    // Call the function
    callDjangoAPI(spotify_id);
  }, [spotify_id]);

  return (
    <div className="userpage">
      <Grid container spacing={1} alignItems={"flex-start"} style={{ marginLeft: "220px" }}>
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>
        {UserInfo && (
          <>
            <Grid item xs={1} align="center" style={{ paddingLeft: "28px" }}>
              <img
                src={UserInfo.images[1].url}
                width="80px"
                className="ProfilePicture"
                alt="Profile"
              />
            </Grid>
            <Grid item xs={11} style={{ paddingLeft: "28px" }}>
              <h1>
                {isAuthenticated ? UserInfo.display_name : "Not Logged in"}
                {isAuthenticated && (
                  <SendFriendRequestButton spotify_id={spotify_id} />
                )}
              </h1>
            </Grid>
            {isAuthenticated && (
              <>
                <Grid
                  item
                  xs={6}
                  style={{ paddingLeft: "28px", paddingRight: "28px" }}
                >
                  <TopTenUserTracks spotify_id={spotify_id} />
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{ paddingLeft: "28px", paddingRight: "28px" }}
                >
                  <TopTenUserArtists spotify_id={spotify_id} />
                </Grid>
                <Grid item xs={12}>
                  <UserPlaylists spotify_id={spotify_id} />
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </div>
  );
};

export default UserPage;
