import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

const SearchResults = () => {
  const { search_type, search_query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search_query && search_type) {
      fetchSearchResults(search_query, search_type);
    }
  }, [search_query, search_type]);

  const fetchSearchResults = async (query, type) => {
    setLoading(true);
    let endpoint;

    switch (type) {
      case "track":
        endpoint = `/auth/search_spotify_tracks/${encodeURIComponent(query)}/`;
        break;
      case "album":
        endpoint = `/auth/search_spotify_albums/${encodeURIComponent(query)}/`;
        break;
      case "artist":
        endpoint = `/auth/search_spotify_artists/${encodeURIComponent(query)}/`;
        break;
      default:
        throw new Error(`Search type "${type}" is not supported`);
    }

    const response = await fetch(endpoint);
    const data = await response.json();

    if (type === "track") {
      setResults(data.tracks.items);
    } else if (type === "album") {
      setResults(data.albums.items);
    } else if (type === "artist") {
      setResults(data.artists.items);
    }

    setLoading(false);
  };

  const renderContent = (type, item) => {
    switch (type) {
      case "track":
        return `${item.name} by ${item.artists
          .map((artist) => artist.name)
          .join(", ")}`;
      case "album":
        return `${item.name} by ${item.artists
          .map((artist) => artist.name)
          .join(", ")}`;
      case "artist":
        return item.name; // Assuming the artist object has a name property
      default:
        return null;
    }
  };

  return (
    <div className="searchpage">
      <Grid
        container
        spacing={1}
        alignItems={"flex-start"}
        style={{ marginLeft: "220px" }}
      >
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>
        <Grid item align="left" xs={12}>
          <h2>Search Results for "{decodeURIComponent(search_query)}"</h2>
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <ul>
              {results.map((item, index) => (
                <li key={index}>
                  {/* TODO: The track ternary is a bandaid fix, should switch the
                  url to /track/id */}
                  <Link
                    to={
                      search_type === "track"
                        ? `/song/${item.id}`
                        : `/${search_type}/${item.id}`
                    }
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {renderContent(search_type, item)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchResults;
