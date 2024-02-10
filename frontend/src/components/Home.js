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
  }

  render() {
    return (
      <Grid container spacing={1} alignItems={"flex-start"}>
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>

        <Grid item xs={3} align="center">
          <h1>Home</h1>
        </Grid>
      </Grid>
    );
  }
}
