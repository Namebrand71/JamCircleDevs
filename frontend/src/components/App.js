// App.js

import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import SongPage from "./SongPage";
import UserPage from "./UserPage";
import ArtistPage from "./ArtistPage";
import SearchResults from "./SearchResults";
export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/song/:spotify_content_id" element={<SongPage />} />
          <Route path="/user/:spotify_id" element={<UserPage />} />
          <Route path="/artist/:spotify_content_id" element={<ArtistPage />} />
          <Route
            path="/search/track/:search_query/"
            element={<SearchResults />}
          />

          {/* Define more routes as needed */}
        </Routes>
      </Router>
    );
  }
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
