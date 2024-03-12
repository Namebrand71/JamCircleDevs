import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TopTenUserTracks from './TopTenUserTracks';
import TopTenUserArtists from './TopTenUserArtists';
import UserPlaylists from './UserPlaylists';
import FriendRequestButton from './FriendRequestButton';
import {Link} from 'react-router-dom'; // Import Link from react-router-dom
import Button from '@mui/material/Button';
const UserPage = () => {
  const {spotify_id} = useParams();
  const [UserInfo, setUserInfo] = useState(null);
  const [isSessionUser, setIsSessionUser] = useState(false);
  const isAuthenticated = true; // TODO: implement an actual check

  useEffect(() => {
    const checkSessionUser = async () => {
      try {
        const response = await fetch(
            `/users/is-session-user/${encodeURIComponent(spotify_id)}/`,
        );
        if (response.ok) {
          const isSessionUser = await response.json();
          console.log(isSessionUser);
          setIsSessionUser(isSessionUser);
        } else {
          console.error('Failed to check session user');
        }
      } catch (error) {
        console.error('There was an error checking session user!', error);
      }
    };

    const callDjangoAPI = async (spotify_id) => {
      try {
        const response = await fetch(
            `/users/get_user_info/${encodeURIComponent(spotify_id)}/`,
        );
        console.log(spotify_id);

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data); // Assuming data is the object with the user details
        } else {
          console.error('Failed to fetch user data');
          setUserInfo(null);
        }
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    // Call the functions
    checkSessionUser();
    callDjangoAPI(spotify_id);
  }, [spotify_id]);

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

      {UserInfo && (
        <>
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
                    src={UserInfo.images[1].url}
                    width="150px"
                    height="150px"
                    alt="Profile"
                  />
                  <h1>
                    {isAuthenticated ? UserInfo.display_name : "Not Logged in"}
                    {isAuthenticated && !isSessionUser && (
                      <FriendRequestButton spotify_id={spotify_id} />
                    )}
                  </h1>
                </div>
              </Grid>

              <Link to={`/friends/${spotify_id}`}>
                <Button variant="contained">Friends</Button>
              </Link>

              {isAuthenticated && (
                <>
                  {/* Page content */}
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                    {/* Display top 10 tracks */}
                    <TopTenUserTracks spotify_id={spotify_id} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                    {/* Display top 10 artists */}
                    <TopTenUserArtists spotify_id={spotify_id} />
                  </Grid>

                  {/* Display playlists */}
                  <Grid item xs={12}>
                    <UserPlaylists spotify_id={spotify_id} />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default UserPage;
