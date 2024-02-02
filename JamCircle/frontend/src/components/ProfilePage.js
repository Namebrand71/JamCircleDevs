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
        <Grid container spacing={1} alignItems={"flex-start"}>
          <Grid item xs={12} align="right">
            <Navbar />
          </Grid>
          <Grid item xs={1} align="center">
            <img src={this.state.profileImageUrl} width="80px" />
          </Grid>
          <Grid item xs={11}>
            <h1>
              {isAuthenticated ? this.state.spotifyUsername : "Not Logged in"}
            </h1>
          </Grid>
          {isAuthenticated && (
            <>
              <Grid item xs={6}>
                <TopTenTracks />
              </Grid>
              <Grid item xs={6}>
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
  }
}
