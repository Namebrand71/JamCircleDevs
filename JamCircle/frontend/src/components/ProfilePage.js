import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Sidebar from "./Sidebar";
import "./ProfilePage.css";
import ProfileCard from "./ProfileCard.js";

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <Sidebar />
        <ProfileCard />
      </div>
    );
  }
}
