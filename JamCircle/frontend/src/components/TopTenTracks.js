import React from "react";

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
            <p>
              {index + 1}. {track.name} -{" "}
              {track.artists.map((artist) => artist.name).join(", ")}{" "}
            </p>
          </div>
        ))}
      </div>
    );
  }
}

export default MyComponent;
