import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const FriendsPage = () => {
  const { spotify_id } = useParams();
  const [results, setResults] = useState([]);
  const [userDisplayName, setUserDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    if (spotify_id) {
      fetchFriendsList(spotify_id);
      fetchFriendRequests();
    }
  }, [spotify_id]);

  const fetchFriendsList = async (spotify_id) => {
    setLoading(true);

    let endpoint = `/users/get-user-friends/${spotify_id}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    setResults(data);

    const displayresponce = await fetch(
      `/users/get-display-name/${spotify_id}/`
    );
    const data2 = await displayresponce.json();
    setUserDisplayName(data2);

    setLoading(false);
  };

  // method to toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => ({
      isDropdownVisible: !prevState.isDropdownVisible,
    }));
  };

  // method to fetch friend requests
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
          <Grid item xs={12} className="FriendsPage">
            {/* Display friend requests */}
            <Button id="button" variant="contained" onClick={toggleDropdown}>
              Show Friend Requests
            </Button>
            {isDropdownVisible && (
              <div id="button">
                {/* Display friend requests in the dropdown */}
                {friendRequests.map((request) => (
                  <div key={request.from_user__display_name} id="requests">
                    <Typography>
                      <Link
                        to={`/user/${request.from_user__spotify_id}`}
                        id="link"
                      >
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

            {/* Top Bar */}
            <div id="TopBar">
              <h1>{userDisplayName}'s Friends</h1>
            </div>
          </Grid>
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <div>
              {/* Display friends */}
              {results && results.length > 0 ? (
                <ul>
                  {results.map((item, index) => (
                    <li key={index} className="ListItem">
                      <Link to={`/user/${item.spotify_id}`} id="Item">
                        <div id="ItemContent">
                          <img src={item.profile_pic_url} alt="Profile" />
                          <div id="Name">
                            <span>{item.display_name}</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <h2>No friends found.</h2>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FriendsPage;
