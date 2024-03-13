import React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled("div")(({ theme }) => ({
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "10px",
  backgroundColor: "#151515",
  color: "white",
  padding: "20px",
  margin: "10px 0",
}));

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: {
        uniqueArtists: 0,
        uniqueSongs: 0,
        highPopularityTracks: 0,
        lowPopularityTracks: 0,
      },
    };
  }

  componentDidMount() {
    this.fetchStats();
  }

  fetchListening = () => {
    fetch("auth/fetch-spotify-activity/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        this.fetchStats();
      })
      .catch((error) =>
        console.error("Error fetching listening history:", error)
      );
  };

  fetchStats = () => {
    fetch("users/get-user-stats/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Calling setState with values:", data);
        this.setState({ stats: data });
      })
      .catch((error) => console.error("Error fetching stats:", error));
  };

  render() {
    const { stats } = this.state;
    return (
      <div>
        <StyledContainer>
          <Typography variant="h4" gutterBottom>
            User Statistics
          </Typography>
          <Box>
            <Typography variant="body1">
              Unique Artists: {stats.unique_artists}
            </Typography>
            <Typography variant="body1">
              Unique Songs: {stats.unique_songs}
            </Typography>
            <Typography variant="body1">
              High Popularity Tracks: {stats.high_popularity_tracks}
            </Typography>
            <Typography variant="body1">
              Low Popularity Tracks: {stats.low_popularity_tracks}
            </Typography>
          </Box>
        </StyledContainer>
        <button onClick={this.fetchListening}>Refresh Listening History</button>
      </div>
    );
  }
}

export default Stats;
