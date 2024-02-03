import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { render } from "react-dom";
import HomePage from "./HomePage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <HomePage />;
  }
}

const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
