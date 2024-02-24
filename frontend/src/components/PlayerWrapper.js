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
    <SpotifyPlayer
      // token="BQAkfdsdaSQvBksGcmDvlkj2DRPKHn-G1PvnM67Tw4ILAeZvtKSNrs4iTO0_dXC7nAmOZlW-wU6FTmAlxr688g1ss9B3cXniiUcS_B36dyCJiQEMbNiuLQ_BlV12oislGTBwIZXYhR1gP1aF5pYmU3FfEeUulRwYGX635mOd0Qr7P_aA31kQzLbZDU1qZuaDYkUNdQBZyXNfztnZdPyLmBME8QzjpCcbcJ4gdA"
      token={accessToken}
      uris={[`spotify:${spotifyContentType}:${spotifyContentId}`]}
      play={true}
    />
  );
};

export default PlayerWrapper;
