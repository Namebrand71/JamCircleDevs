import React from "react";
import "./ProfilePage.css";

<<<<<<< HEAD
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
=======
export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyUsername: "Loading...",
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
      .then((data) => this.setState({ spotifyUsername: data.display_name }))
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
>>>>>>> 22c1020cf1bee47a48abac1c31c19426ae068ca4
