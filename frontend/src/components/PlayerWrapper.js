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
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "auto",
          width: "100%",
          position: "fixed",
          left: "0",
          bottom: "0",
          maxHeight: "auto",
          backgroundColor: "#111111",
          color: "white",
          padding: "0px",
          boxSizing: "border-box",
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
