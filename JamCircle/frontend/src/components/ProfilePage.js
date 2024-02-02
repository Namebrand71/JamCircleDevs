import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Sidebar from "./Sidebar";
import TopTenTracks from "./TopTenTracks";
import TopTenArtists from "./TopTenArtists";
import "./ProfilePage.css";
import ProfileCard from "./ProfileCard.js";
import TopSongs from "./TopSongs";
import TopArtists from "./TopArtists";

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
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <Sidebar />
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <img src={this.state.profileImageUrl} width="80px" />
              <h1>{this.state.spotifyUsername}</h1>
            </div>
            <div className="profile-info">
              <div className="profile-section">
                <h2>Top Artists</h2>
                {/* <TopArtists artists={artistData.artists} /> */}
              </div>
              <div className="profile-section">
                <h2>Top Songs</h2>
                {/* <TopSongs /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
