import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import SearchBar from './SearchBar';
import {useAuth} from '../contexts/AuthContext';
import Leaderboard from './LeaderBoard';

const HomePage = () => {
  const [listeningHistory, setListeningHistory] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [spotifyUsername, setSpotifyUsername] = useState('Loading...');
  const [currentSpotifyId, setCurrentSpotifyId] = useState(undefined);
  const {accessToken} = useAuth();
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch('/auth/profile/');
        if (!profileResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const profileData = await profileResponse.json();
        setSpotifyUsername(profileData.display_name);
        setCurrentSpotifyId(profileData.id);

        if (isAuthenticated) {
          const historyResponse = await fetch(
              `/api/all-listening-history/${encodeURIComponent(profileData.id)}`,
          );
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            setListeningHistory(historyData);
          } else {
            console.error('Failed to fetch listening history');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setSpotifyUsername('Loading...');
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const displayedHistory = showAll ?
    listeningHistory :
    listeningHistory.slice(0, 5);

  return (
    <Grid
      container
      spacing={4}
      columns={{xs: 4, sm: 8, md: 12, lg: 20, xl: 20}}
    >
      <img src="../../../static/images/Banner.png" width="100%" />
      <Grid
        item
        xs={4}
        sm={4}
        md={10}
        lg={20}
        xl={20}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px',
          background: '#171717',
        }}
      >
        <div
          id="Stats"
          style={{marginLeft: '20px', display: 'flex', alignItems: 'center'}}
        >
          <h1 style={{fontSize: '3rem'}}>
            {isAuthenticated ?
              `Welcome ${spotifyUsername}` :
              'Please log in to view history'}
          </h1>
        </div>
        <div style={{marginLeft: 'auto'}}>
          <SearchBar onSearch={() => {}} />
        </div>
      </Grid>

      <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
        {/* <Navbar /> */}
      </Grid>
      {isAuthenticated && (
        <Grid item xs={4} sm={4} md={10} lg={14} xl={14}>
          <h2>Leaderboard</h2>
          <Leaderboard />
          {/* Render listening history */}

          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
              borderRadius: '15px',
              padding: '10px',
              backgroundColor: '#151515',
              marginBottom: '40px',
            }}
          >
            <h2
              style={{
                paddingBottom: '10px',
                paddingLeft: '10px',
                borderBottom: '2px solid #2a2a2a',
              }}
            >
              Recent Activity
            </h2>
            {displayedHistory.map((track, index) => (
              <Link
                to={`/song/${track.track_id}`}
                key={index}
                className="activity-item"
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    alignItems: 'center',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <img
                      src={track.user_profile_image}
                      style={{borderRadius: '50%'}}
                      alt="Profile"
                    />

                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          paddingBottom: '5px',
                          marginLeft: '10px',
                          color: 'white',
                        }}
                      >
                        {track.track_name}
                      </span>
                      <span
                        style={{
                          paddingBottom: '5px',
                          marginLeft: '10px',
                          color: 'white',
                        }}
                      >
                        {track.artist_names}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p style={{color: 'white'}}>
                      {new Date(track.played_at).toLocaleString()}
                    </p>
                  </div>
                  {/* Additional track details */}
                </div>
              </Link>
            ))}

            {listeningHistory.length > 5 && !showAll && (
              <h3
                style={{
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onClick={() => setShowAll(true)}
              >
                Show more
              </h3>
            )}

            {listeningHistory.length > 5 && showAll && (
              <h3
                style={{
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onClick={() => setShowAll(false)}
              >
                Show less
              </h3>
            )}
          </div>
        </Grid>
      )}
    </Grid>
  );
};

export default HomePage;
