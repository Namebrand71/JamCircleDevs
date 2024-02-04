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
    const displayedPlaylists = isExpanded ? playlists : playlists.slice(0, 5);

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "20px",
            paddingLeft: "28px",
          }}
        >
          <h2 style={{ color: "white" }}>Playlists</h2>
          {playlists.length > 3 && (
            <button
              onClick={this.toggleExpand}
              style={{
                alignSelf: "flex-end",
                background: "transparent",
                border: "none",
                color: "white", // Adjust for visibility
                cursor: "pointer",
              }}
              className="more-btn"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            padding: "20px",
          }}
        >
          {displayedPlaylists.map((playlist, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #000000",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#181818",
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
              <h3 style={{ marginTop: "10px", color: "white" }}>
                {playlist.name}
              </h3>
              <p style={{ color: "white" }}>By {playlist.owner}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Playlists;