import React, { createContext, useState, useContext } from "react";

// Create a context with a default empty value
const AuthContext = createContext({
  accessToken: "",
  setAccessToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");

  // Value to be provided to the context consumers
  const value = { accessToken, setAccessToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
