import React, { Component } from "react";

class Playlists extends Component {
  state = {
    playlists: [],
  };

  componentDidMount() {
    this.fetchPlaylists();
  }

  fetchPlaylists = () => {
    fetch("/auth/get-playlists/")
      .then((response) => response.json())
      .then((data) => this.setState({ playlists: data }))
      .catch((error) => console.error("Error fetching playlists:", error));
  };

  render() {
    const { playlists } = this.state;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {playlists.map((playlist, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <img
              src={playlist.image_url}
              alt={playlist.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <h3 style={{ marginTop: "10px" }}>{playlist.name}</h3>
            <p>By {playlist.owner}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default Playlists;
