import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { TextField } from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Navbar from "./NavBar";
import TopTenTracks from "./TopTenTracks";
import TopTenArtists from "./TopTenArtists";
import Playlists from "./Playlists";
import SearchBar from "./SearchBar";
import handleSearch from "./NavBar";

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyUsername: "Loading...",
      profileImageUrl: "https://fakeimg.pl/750x750?text=Loading&font=noto",
      isAuthenticated: false,
      friendRequests: [],
      isDropdownVisible: false,
    };
  }

  async componentDidMount() {
    const isAuthenticated = await this.checkAuthentication();
    if (isAuthenticated) {
      this.loadProfile();
      this.fetchFriendRequests(); // Fetch friend requests on component mount
    }
  }

  checkAuthentication = async () => {
    try {
      const response = await fetch("/auth/is-authenticated/");
      const data = await response.json();
      this.setState({ isAuthenticated: data.isAuthenticated });
      return data.isAuthenticated;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  loadProfile = () => {
    fetch("/auth/profile/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) =>
        this.setState({
          spotifyUsername: data.display_name,
          profileImageUrl: data.images[1].url,
        })
      )
      .catch((error) => {
        console.error("Fetch error:", error);
        this.setState({ spotifyUsername: "Failed to load" });
      });
  };

  // Add a method to toggle the dropdown visibility
  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownVisible: !prevState.isDropdownVisible,
    }));
  };

  // Add a method to fetch friend requests
  fetchFriendRequests = async () => {
    try {
      const response = await fetch("/users/get-user-pending-friends/");
      const data = await response.json();
      console.log(data)
      this.setState({ friendRequests: data });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  handleAcceptRequest = async (friendRequest) => {
    const spotify_id = friendRequest?.from_user__spotify_id;
  
    // Ensure spotify_id is not undefined before making the fetch
    if (spotify_id) {
      try {
        await fetch(`/users/accept-friend-request/${spotify_id}`);
        // After accepting the request, fetch updated friend requests
        this.fetchFriendRequests();
      } catch (error) {
        console.error('Error accepting friend request:', error);
      }
    } else {
      console.error('Invalid friend request data:', friendRequest);
    }
  };
  

  handleRejectRequest = async (friendRequest) => {
    const { from_user: { spotify_id } } = friendRequest;
    try {
      await fetch(`/users/reject-friend-request/${spotify_id}`);
      // After rejecting the request, fetch updated friend requests
      this.fetchFriendRequests();
      
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  render() {
    const { isAuthenticated, friendRequests, isDropdownVisible } = this.state;

    return (
      <div className="profilepage">
        <Grid
          container
          spacing={1}
          columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
        >
          {/* Navbar Grid item */}
          <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
            <Navbar />
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
                    src={this.state.profileImageUrl}
                    width="150px"
                    height="150px"
                    className="ProfilePicture"
                  />
                  <h1 style={{ marginLeft: "40px", fontSize: "3rem" }}>
                    {isAuthenticated
                      ? this.state.spotifyUsername
                      : "Not Logged in"}
                  </h1>
                </div>

                <SearchBar onSearch={handleSearch} />
              </Grid>

              {/* Button to toggle the dropdown */}
              <Grid item xs={12} style={{ paddingLeft: "28px" }}>
                <Button variant="contained" onClick={this.toggleDropdown}>
                  Show Friend Requests
                </Button>
                {isDropdownVisible && (
                  <div style={{ marginTop: "16px" }}>
                    {/* Display friend requests in the dropdown */}
                    {friendRequests.map((request) => (
                      <div
                        key={request.from_user}
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
                          <Link to={`/user/${request}`}>
                            {request.from_user}
                          </Link>
                        </Typography>
                        <Button
                          onClick={() =>
                            this.handleAcceptRequest(request)
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() =>
                            this.handleRejectRequest(request)
                          }
                        >
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
  }
}
