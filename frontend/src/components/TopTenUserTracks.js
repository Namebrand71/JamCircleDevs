import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const StyledContainer = styled("div")(({ theme }) => ({
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "10px",
  backgroundColor: "#151515", // Dark grey color
  color: "white", // Sets text color to white
  padding: "20px",
  margin: "10px 0", // Adds some space above and below the container
}));

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks: [],
    };
  }

  componentDidMount() {
    const { spotify_id } = this.props;
    this.fetchUserTop10Tracks(`/users/get-user-top-10-tracks/${encodeURIComponent(spotify_id)}`);
  }

  fetchUserTop10Tracks = (url) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ topTracks: data });
      })
      .catch((error) => console.error("Error fetching top tracks:", error));
  };

  render() {
    return (
      <StyledContainer>
        <Typography variant="h4" gutterBottom>
          Top Tracks
        </Typography>
        <Grid container spacing={1}>
          {this.state.topTracks.map((track, index) => (
            <Grid item xs={12} sm={10} md={9} lg={7} key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  marginBottom: 0.1, // Adds some space between the image and the artist name
                }}
              >
                <Link
                  to={`/song/${track.id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Typography>
                    {index + 1}. {track.name} -{" "}
                    {track.artist_names.map((artist, index) => (
                      <span key={index}>
                        {artist}
                        {index < track.artist_names.length - 1 && ', '}
                      </span>
                    ))}
                  </Typography>
                </Link>
              </Box>
            </Grid>
          ))}
        </Grid>
      </StyledContainer>
    );
  }
}

export default MyComponent;
