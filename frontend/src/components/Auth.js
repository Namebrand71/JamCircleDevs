import React, { useEffect } from "react";
import useInterval from "./hooks/UseInterval";

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
  useInterval(fetchAuth, 10000);

  return null;
};

export default Auth;
