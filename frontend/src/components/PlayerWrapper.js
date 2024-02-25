import SpotifyPlayer from "react-spotify-web-playback";
import React, { Component } from "react";
import { useAuth } from "../contexts/AuthContext";

const PlayerWrapper = ({ spotifyContentId, spotifyContentType }) => {
  const { accessToken } = useAuth();

  if (!spotifyContentId) {
    return null;
  }

  return (
    <>
      <div
        style={{
          // display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center", // Changed to center the children horizontally
          height: "auto", // Full height of the viewport
          width: "100%", // Width of the sidebar
          position: "fixed", // Fixed position
          left: "0", // Align to the left side of the viewport
          bottom: "0", // Align to the bottom of the viewport
          maxHeight: "auto",
          backgroundColor: "#111111", // Background color of the sidebar
          color: "white",
          padding: "0px", // Padding inside the sidebar
          boxSizing: "border-box", // Ensures padding doesn't affect the set width
        }}
      >
        <SpotifyPlayer
          token={accessToken}
          uris={[`spotify:${spotifyContentType}:${spotifyContentId}`]}
          play={true}
          layout="responsive"
          hideAttribution={true}
          styles={{
            activeColor: "#fff",
            bgColor: "#333",
            color: "#fff",
            loaderColor: "#fff",
            sliderColor: "#1cb954",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
          }}
        />
      </div>
    </>
  );
};

export default PlayerWrapper;
