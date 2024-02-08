// App.js

import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import SongPage from "./SongPage";
export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/song/:spotify_content_id" element={<SongPage />} />

          {/* Define more routes as needed */}
        </Routes>
      </Router>
    );
  }
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
