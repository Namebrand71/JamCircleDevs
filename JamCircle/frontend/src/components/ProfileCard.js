import React from "react";
import "./ProfilePage.css";
import TopSongs from "./TopSongs";
import TopArtists from "./TopArtists";

//MOCK DATA
const artistData = {
  artists: [
    {
      genres: ["Prog rock", "Grunge"],
      id: "string",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
          height: 100,
          width: 100,
        },
      ],
      name: "Taylor Swift",
    },
    {
      genres: ["Prog rock", "Grunge"],
      id: "string",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
          height: 100,
          width: 100,
        },
      ],
      name: "Taylor Swift",
    },
    {
      genres: ["Prog rock", "Grunge"],
      id: "string",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
          height: 100,
          width: 100,
        },
      ],
      name: "Taylor Swift",
    },
    {
      genres: ["Prog rock", "Grunge"],
      id: "string",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
          height: 100,
          width: 100,
        },
      ],
      name: "Taylor Swift",
    },
    // ... more artists
  ],
};

const ProfileCard = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="profile-image"
          />
          <h1>User Name</h1>
        </div>
        <div className="profile-info">
          <div className="profile-section">
            <h2>Top Artists</h2>
            <TopArtists artists={artistData.artists} />
          </div>
          <div className="profile-section">
            <h2>Top Songs</h2>
            <TopSongs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
