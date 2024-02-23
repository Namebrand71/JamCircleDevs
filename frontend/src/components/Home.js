import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material/Typography";
import { TextField } from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Navbar from "./NavBar";
import SearchBar from "./SearchBar";
import handleSearch from "./NavBar";

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid
        container
        spacing={1}
        columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
      >
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3} align="right">
          <Navbar />
        </Grid>

        <Grid
          item
          xs={4}
          sm={4}
          md={8}
          lg={16}
          xl={16}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>Home</h1>
          </div>
          <SearchBar onSearch={handleSearch} />
        </Grid>
      </Grid>
    );
  }
}
