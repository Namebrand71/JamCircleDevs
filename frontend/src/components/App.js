// App.js

import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import SongPage from "./SongPage";
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
          <Route path="/artist/:spotify_content_id" element={<ArtistPage />} />
          <Route
            path="/search/:search_type/:search_query/"
            element={<SearchResults />}
          />
        </Routes>
      </Router>
    );
  }
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
