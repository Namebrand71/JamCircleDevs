import React, { Component } from "react";
import ProfilePage from "./ProfilePage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material/Typography";
import { TextField } from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Home from "./Home";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Home />;
  }
}
