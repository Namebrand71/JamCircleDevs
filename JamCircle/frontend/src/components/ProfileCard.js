import React from "react";
import "./ProfilePage.css";

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
            {/* <TopArtists artists={artistData.artists} /> */}
          </div>
          <div className="profile-section">
            <h2>Top Songs</h2>
            {/* <TopSongs /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
