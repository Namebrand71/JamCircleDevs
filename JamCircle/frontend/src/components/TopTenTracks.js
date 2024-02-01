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
      <div>
        <button onClick={this.handleClick}>Get Top 10 Tracks</button>
        <div>
          {this.state.topTracks.map((track, index) => (
            <div key={index}>
              {track.name} - {track.artist}
            </div> // Adjust according to your track object structure
          ))}
        </div>
      </div>
    );
  }
}

export default MyComponent;
