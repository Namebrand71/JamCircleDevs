import React from "react";

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks: [],
    };
  }

  handleClick = () => {
    fetch("/auth/get-top-10-tracks/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ topTracks: data });
      })
      .catch((error) => console.error("Error:", error));
  };

  render() {
    return (
      <div className="topTracksContainer">
        <button onClick={this.handleClick}>Get Top 10 Tracks</button>
        {this.state.topTracks.map((track, index) => (
          <div key={index}>
            <p>
              {track.name} -{" "}
              {track.artists.map((artist) => artist.name).join(", ")}{" "}
            </p>
          </div>
        ))}
      </div>
    );
  }
}

export default MyComponent;
