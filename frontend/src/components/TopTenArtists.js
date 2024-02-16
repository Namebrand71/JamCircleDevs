import React from "react";

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topArtists: [],
    };
  }

  componentDidMount() {
    this.fetchTop10Artists();
  }

  fetchTop10Artists = () => {
    fetch("/auth/get-top-10-artists/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ topArtists: data });
      })
      .catch((error) => console.error("Error fetching top artists:", error));
  };

  render() {
    return (
      <div className="topArtistsContainer">
        <h2>Top Artists</h2>
        {this.state.topArtists.map((artist, index) => (
          <div key={index}>
            <Link
              to={`artist/${artist.id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <p>
               {index + 1}. {artist.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    );
  }
}

export default MyComponent;
