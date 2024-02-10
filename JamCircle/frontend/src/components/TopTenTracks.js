import React from "react";
import { Link } from "react-router-dom";
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks: [],
    };
  }

  componentDidMount() {
    this.fetchTop10Tracks();
  }

  fetchTop10Tracks = () => {
    fetch("/auth/get-top-10-tracks/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ topTracks: data });
      })
      .catch((error) => console.error("Error fetching top tracks:", error));
  };

  render() {
    return (
      <div className="topTracksContainer">
        <h2>Top Tracks</h2>
        {this.state.topTracks.map((track, index) => (
          <div key={index}>
            <Link
              to={`/song/${track.id}`}
              style={{
                textDecoration: "none",
                color: "white",
                borderBottom: "2px solid white",
              }}
            >
              <p>
                {index + 1}. {track.name} -{" "}
                {track.artists.map((artist) => artist.name).join(", ")}{" "}
              </p>
            </Link>
          </div>
        ))}
      </div>
    );
  }
}

export default MyComponent;
