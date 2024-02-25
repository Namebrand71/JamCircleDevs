import React, { useEffect } from "react";
import useInterval from "../hooks/UseInterval";
import { useAuth } from "../contexts/AuthContext";

const ACCESS_TOKEN_REFRESH_INTERVAL = 60 * 30 * 1000;

const Auth = ({ onAuthStateChange }) => {
  const { setAccessToken } = useAuth();

  const fetchAuth = () => {
    console.log("Fetch auth about to fetch");
    fetch("/auth/is-authenticated/")
      .then((response) => response.json())
      .then((data) => {
        setAccessToken(data.isAuthenticated.accessToken);
        // onAuthStateChange(data.isAuthenticated.accessToken);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  console.log("Setting up useEffect for fetchAuth");
  useEffect(fetchAuth, []);
  useInterval(fetchAuth, ACCESS_TOKEN_REFRESH_INTERVAL);

  return null;
};

export default Auth;
