import React, { useEffect } from "react";
import useInterval from "../hooks/UseInterval";

const ACCESS_TOKEN_REFRESH_INTERVAL = 60 * 30 * 1000;

const fetchAuth = () => {
  fetch("/auth/is-authenticated/")
    .then((response) => response.json())
    .then((data) => {
      onAuthStateChange(data.isAuthenticated.accessToken);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const Auth = ({ onAuthStateChange }) => {
  const fetchAuth = () => {
    fetch("/auth/is-authenticated/")
      .then((response) => response.json())
      .then((data) => {
        onAuthStateChange(data.isAuthenticated.accessToken);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(fetchAuth, []);
  useInterval(fetchAuth, ACCESS_TOKEN_REFRESH_INTERVAL);

  return null;
};

export default Auth;
