import React, { Component } from "react";
import ProfilePage from "./ProfilePage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<p>THIS IS THE HOME PAGE</p>} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    );
  }
}
