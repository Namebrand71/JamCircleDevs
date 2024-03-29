import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import SongPage from "./SongPage";
import UserPage from "./UserPage";
import FriendsPage from "./FriendsPage";
import AlbumPage from "./AlbumPage";
import ArtistPage from "./ArtistPage";
import SearchResults from "./SearchResults";
import Navbar from "./NavBar";
import PlayerWrapper from "./PlayerWrapper";
import Auth from "./Auth";
import Lobby from "./Lobby";
import MusicRoom from "./MusicRoom";
import { AuthProvider } from "../contexts/AuthContext";

const App = () => {
  const [spotifyContentId, setSpotifyContentId] = useState(null);
  const [spotifyContentType, setSpotifyContentType] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Fetch initial data when the component is mounted
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`/musicrooms/start-token-server`);
        if (response.ok) {
          const data = await response.json();
          console.log("Initial data:", data);
        } else {
          console.error("Failed to fetch initial data");
        }
      } catch (error) {
        console.error("Error fetching initial data", error);
      }
    };

    fetchInitialData();
  }, []);

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
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/musicroom" element={<MusicRoom />} />
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

const container = document.getElementById("app");
const root = ReactDOM.createRoot(container);
root.render(<App />);
