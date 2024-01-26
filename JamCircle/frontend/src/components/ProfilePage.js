import React from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <div className="profile-container">
      {/* <SideBar /> */}
      <ProfileCard />
    </div>
  );
};

const ProfileCard = () => {
  return (
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
        </div>
        <div className="profile-section">
          <h2>Top Songs</h2>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
