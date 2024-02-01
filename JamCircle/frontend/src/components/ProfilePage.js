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

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyUsername: "Loading...",
      profileImageUrl: "https://fakeimg.pl/750x750?text=Loading&font=noto",
    };
  }

  componentDidMount() {
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
  }

  render() {
    return (
      <Grid container spacing={1} alignItems={"flex-start"}>
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>
        <Grid item xs={1} align="center">
          <img src={this.state.profileImageUrl} width="80px" />
        </Grid>
        <Grid item xs={3}>
          <h1>{this.state.spotifyUsername}</h1>
        </Grid>
        <Grid item xs={12}>
          <TopTenTracks />
        </Grid>
      </Grid>
    );
  }
}
