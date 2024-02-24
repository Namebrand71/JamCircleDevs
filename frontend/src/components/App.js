// App.js

import React, { Component } from "react";
import { createRoot } from "react-dom/client";
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

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/song/:spotify_content_id" element={<SongPage />} />
        <Route path="/user/:spotify_id" element={<UserPage />} />
        <Route path="/friends/:spotify_id" element={<FriendsPage />} />
        <Route path="/album/:spotify_content_id" element={<AlbumPage />} />
        <Route path="/artist/:spotify_content_id" element={<ArtistPage />} />
        <Route
          path="/search/:search_type/:search_query/"
          element={<SearchResults />}
        />
      </Routes>
    </Router>
  );
};

export default App;

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
