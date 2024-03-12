import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {Box, Container} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Link} from 'react-router-dom';

const StyledContainer = styled('div')(({theme}) => ({
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: '10px',
  backgroundColor: '#151515', // Dark grey color
  color: 'white', // Sets text color to white
  padding: '20px',
  margin: '10px 0', // Adds some space above and below the container
}));

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topArtists: [],
    };
  }

  componentDidMount() {
    const {spotify_id} = this.props;
    this.fetchUserTop10Artists(
        `/users/get-user-top-10-artists/${encodeURIComponent(spotify_id)}`,
    );
  }

  fetchUserTop10Artists = (url) => {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.setState({topArtists: data});
        })
        .catch((error) => console.error('Error fetching top artists:', error));
  };

  render() {
    return (
      <StyledContainer>
        <Typography variant="h4" gutterBottom>
          Top Artists
        </Typography>
        <Grid container spacing={1}>
          {this.state.topArtists.slice(0, 10).map((artist, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
              <Link to={`/artist/${artist.id}`} className="TopTen">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 7, // Adds some space between the image and the artist name
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      height: 100,
                      width: 100,
                      borderRadius: '50%',
                      marginBottom: 2,
                    }}
                    alt={artist.name}
                    src={artist.image_url}
                  />
                  <Typography align="center">
                    {index + 1}. {artist.name}
                  </Typography>
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      </StyledContainer>
    );
  }
}

export default MyComponent;
