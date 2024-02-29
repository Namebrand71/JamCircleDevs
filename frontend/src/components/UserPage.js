import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TopTenUserTracks from "./TopTenUserTracks";
import TopTenUserArtists from "./TopTenUserArtists";
import UserPlaylists from "./UserPlaylists";
import FriendRequestButton from "./FriendRequestButton";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Button from "@mui/material/Button";
const UserPage = () => {
  const { spotify_id } = useParams();
  const [UserInfo, setUserInfo] = useState(null);
  const [isSessionUser, setIsSessionUser] = useState(false);
  const isAuthenticated = true; // TODO: implement an actual check

  useEffect(() => {
    const checkSessionUser = async () => {
      try {
        const response = await fetch(
          `/users/is-session-user/${encodeURIComponent(spotify_id)}/`
        );
        if (response.ok) {
          const isSessionUser = await response.json();
          console.log(isSessionUser);
          setIsSessionUser(isSessionUser);
        } else {
          console.error("Failed to check session user");
        }
      } catch (error) {
        console.error("There was an error checking session user!", error);
      }
    };

    const callDjangoAPI = async (spotify_id) => {
      try {
        const response = await fetch(
          `/users/get_user_info/${encodeURIComponent(spotify_id)}/`
        );

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

    // Call the functions
    checkSessionUser();
    callDjangoAPI(spotify_id);
  }, [spotify_id]);

  return (
    <div className="userpage">
      <Grid
        container
        spacing={1}
        alignItems={"flex-start"}
        style={{ marginLeft: "220px" }}
      >
        <Grid item xs={12} align="right">
          {/* <Navbar /> */}
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
              <Link to={`/friends/${spotify_id}`}>
                <Button variant="contained">Friends</Button>
              </Link>
            </Grid>
            <Grid item xs={11} style={{ paddingLeft: "28px" }}>
              <h1>
                {isAuthenticated ? UserInfo.display_name : "Not Logged in"}
                {isAuthenticated && !isSessionUser && (
                  <FriendRequestButton spotify_id={spotify_id} />
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
