import SpotifyPlayer from "react-spotify-web-playback";
import React, { Component } from "react";

<SpotifyPlayer
  token="BQAI_7RWPJuqdZxS-I8XzhkUi9RKr8Q8UUNaJAHwWlpIq6..."
  uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
/>;

const PlayerWrapper = ({
  spotifyContentId,
  spotifyContentType,
  accessToken,
}) => {
  console.log("rendering player wrapper with access token: ", accessToken);
  if (!spotifyContentId) {
    return null;
  }

  return (
    <>
      <div style={{ marginTop: "auto" }}></div>
      <SpotifyPlayer
        token={accessToken}
        uris={[`spotify:${spotifyContentType}:${spotifyContentId}`]}
        play={true}
        layout="compact"
      />
    </>
  );
};

export default PlayerWrapper;
