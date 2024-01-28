import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material/Typography";
import { TextField } from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Navbar from "./NavBar";

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyUsername: "Loading...",
    };
  }

  componentDidMount() {
    fetch("/auth/profile/")
      .then((response) => response.json())
      .then((data) => this.setState({ spotifyUsername: data.display_name }))
      .catch((error) => this.setState({ spotifyUsername: "Failed to load" }));
  }

  render() {
    return (
      <Grid container spacing={1} alignItems={"flex-start"}>
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>
        <Grid item xs={1} align="center">
          <img
            src="https://fakeimg.pl/750x750?text=Pic&font=noto"
            width="80px"
          />
        </Grid>
        <Grid item xs={3}>
          <h1>{this.state.spotifyUsername}</h1>
        </Grid>
      </Grid>
    );
  }
}
