import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks: [],
    };
  }

  componentDidMount() {
    this.fetchTop10Tracks();
  }

  fetchTop10Tracks = () => {
    fetch("/auth/get-top-10-tracks/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ topTracks: data });
        console.log(data);
      })
      .catch((error) => console.error("Error fetching top tracks:", error));
  };

  render() {
    return (
      <Box
        className="topTracksContainer"
        sx={{
          overflowY: 'hidden',
          borderRadius: '10px',
          backgroundColor: '#151515',
          color: 'white', 
          padding: '20px',
          margin: '10px 0', 
        }}
      >
        <Typography variant="h4" gutterBottom>
          Top Tracks
        </Typography>
        <Grid container spacing={2}>
          {this.state.topTracks.slice(0,5).map((track, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    borderBottom: '2px solid white',
                  },
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 60,
                    width: 60,
                    marginRight: '20px',
                    borderRadius: '4px',
                  }}
                  alt={`Album art for ${track.name}`}
                  src={track.album.images[2].url}
                />
                <RouterLink
                  to={`/song/${track.id}`}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    display: 'flex',
                    alignItems: 'center', // This ensures the text aligns with the image vertically
                  }}
                >
                  <Typography variant="body1">
                    {index + 1}. {track.name} - {track.artists.map(artist => artist.name).join(", ")}
                  </Typography>
                </RouterLink>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
}

export default MyComponent;
