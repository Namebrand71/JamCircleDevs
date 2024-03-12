import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Reviews from './Reviews';

const SongPage = ({onPlay}) => {
  const {spotify_content_id} = useParams();
  const [albumInfo, setAlbumInfo] = useState(null);

  useEffect(() => {
    const callDjangoAPI = async () => {
      try {
        const response = await fetch(
            'http://127.0.0.1:8000/reviews/get_album_info/',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({spotify_content_id: spotify_content_id}),
            },
        );

        if (response.ok) {
          const data = await response.json();
          setAlbumInfo(data); // Assuming data is the object with the Album details
        } else {
          console.error('Failed to fetch song data');
          setAlbumInfo(null);
        }
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    // Call the function
    callDjangoAPI();
  }, [spotify_content_id]);

  return (
    <Grid container spacing={1}>
      {/* Navbar grid item */}
      <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
        {/* <Navbar /> */}
      </Grid>

      {/* Songcard grid item */}
      <Grid item xs={6} sm={6} md={5} lg={5} xl={5}>
        {albumInfo ? (
          <div align="center" className="songcard">
            <img src={albumInfo.images[0].url} alt="Album Cover" />
            <h1>{albumInfo.name}</h1>
            <button onClick={() => onPlay(spotify_content_id, "album")}>
              Play Album
            </button>
          </div>
        ) : (
          <h1>Loading Album info...</h1>
        )}
      </Grid>

      {/* Reviews grid item */}
      <Grid item xs={3} sm={3} md={5} lg={5} xl={5} align="center">
        <Reviews spotifyContentId={spotify_content_id} />
      </Grid>
    </Grid>
  );
};

export default SongPage;
