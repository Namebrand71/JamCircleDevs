// App.js

import React, {Component, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import SongPage from './SongPage';
import UserPage from './UserPage';
import FriendsPage from './FriendsPage';
import AlbumPage from './AlbumPage';
import ArtistPage from './ArtistPage';
import SearchResults from './SearchResults';
import Navbar from './NavBar';
import DummyPlayer from './DummyPlayer';
import PlayerWrapper from './PlayerWrapper';
import Auth from './Auth';
import {AuthProvider} from '../contexts/AuthContext';

const App = () => {
  const [spotifyContentId, setSpotifyContentId] = useState(null);
  const [spotifyContentType, setSpotifyContentType] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const handlePlay = (spotifyContentId, spotifyContentType) => {
    setSpotifyContentId(spotifyContentId);
    setSpotifyContentType(spotifyContentType);
  };

  return (
    <AuthProvider>
      <Router>
        <Auth />
        <Navbar
          spotifyContentId={spotifyContentId}
          spotifyContentType={spotifyContentType}
        />
        <PlayerWrapper
          spotifyContentId={spotifyContentId}
          spotifyContentType={spotifyContentType}
          accessToken={accessToken}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/song/:spotify_content_id"
            element={<SongPage onPlay={handlePlay} />}
          />
          <Route path="/user/:spotify_id" element={<UserPage />} />
          <Route path="/friends/:spotify_id" element={<FriendsPage />} />
          <Route
            path="/album/:spotify_content_id"
            element={<AlbumPage onPlay={handlePlay} />}
          />
          <Route
            path="/artist/:spotify_content_id"
            element={<ArtistPage onPlay={handlePlay} />}
          />
          <Route
            path="/search/:search_type/:search_query/"
            element={<SearchResults />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
