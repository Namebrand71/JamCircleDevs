import SpotifyPlayer from "react-spotify-web-playback";
import React, { Component } from "react";

<SpotifyPlayer
  token="BQAI_7RWPJuqdZxS-I8XzhkUi9RKr8Q8UUNaJAHwWlpIq6..."
  uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
/>;

const PlayerWrapper = () => {
  return (
    <SpotifyPlayer
      token="BQAOYq8nHMxX2mqDjWCGZ3NA5KQXYQSIdejyS9xT6DIS4dOPgAJEVwfa2pCstlXmMYbEs1MoAyX6bgrha7CMbW7viAWYZ6GbBarVMC6tWSO-DJoYSu1q5dh7qjKqi1KDhCG9ZvOrxWTJFM-T-JWh-aD_O2FdiK8nRfwdOYkLMJ2SL7k7aD2c-F4DTRDVdex5nv3s16AMyzYqBaU1e-Cvt7kjZugtq95FxRZDMw"
      uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
    />
  );
};

export default PlayerWrapper;
