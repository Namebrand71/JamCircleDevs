import React from "react";

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topArtists: [],
    };
  }

  handleClick = () => {
    fetch("/auth/get-top-10-artists/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ topArtists: data });
      })
      .catch((error) => console.error("Error:", error));
  };

  render() {
    return (
      <div className="topArtistsContainer">
        <button onClick={this.handleClick}>Get Top 10 Artists</button>
        {this.state.topArtists.map((artist, index) => (
          <div key={index}>
            <p>{artist.name}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default MyComponent;
