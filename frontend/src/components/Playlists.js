import React, { Component } from "react";

class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      playlists: [],
    };
  }

  componentDidMount() {
    this.fetchPlaylists();
  }

  fetchPlaylists = () => {
    fetch("/auth/get-playlists/")
      .then((response) => response.json())
      .then((data) => this.setState({ playlists: data }))
      .catch((error) => console.error("Error fetching playlists:", error));
  };

  toggleExpand = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  render() {
    const { playlists, isExpanded } = this.state;
    const displayedPlaylists = isExpanded ? playlists : playlists.slice(0, 6);

    return (
      <div>
        <div className="ShowMore">
          <h2>Playlists</h2>
          {playlists.length > 3 && (
            <button onClick={this.toggleExpand}>
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
        <div className="Playlist">
          {displayedPlaylists.map((playlist, index) => (
            <div key={index}>
              <img src={playlist.image_url} alt={playlist.name} />
              <h3>{playlist.name}</h3>
              <p>By {playlist.owner}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Playlists;
