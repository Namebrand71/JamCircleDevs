import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material/Typography";
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
    };
  }

  async componentDidMount() {
    const isAuthenticated = await this.checkAuthentication();
    if (isAuthenticated) {
      this.loadProfile();
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

  render() {
    const { isAuthenticated } = this.state;

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
