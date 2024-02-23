import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

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
        columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
      >
        {/* Navbar Grid item */}
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
          <Navbar />
        </Grid>

        {/* Content Grid item */}
        <Grid item xs={4} sm={4} md={8} lg={16} xl={16}>
          <Grid container spacing={1} alignItems="flex-start">
            {/* Profile Picture and Username */}
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "28px",
                borderBottom: "2px solid #2a2a2a",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2>Search Results for "{decodeURIComponent(search_query)}"</h2>
              </div>
              <div style={{ paddingTop: "10px" }}>
                <SearchBar />
              </div>
            </Grid>
            <ul>
              {results.map((item, index) => (
                <li key={index} className="list-item">
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
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchResults;
