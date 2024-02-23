import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import handleSearch from "./NavBar";
import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button";

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
        return `${item.artists.map((artist) => artist.name).join(", ")}`;
      case "album":
        return `${item.artists.map((artist) => artist.name).join(", ")}`;
      default:
        return null;
    }
  };

  function check({ item }) {
    if (!("images" in item)) {
      return false;
    }
  }

  return (
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <Button variant="contained">Go Back</Button>
              </Link>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2>Search Results for "{decodeURIComponent(search_query)}"</h2>
              </div>
            </div>
            {/* <div style={{ paddingTop: "10px" }}> Searching for album from rsearch result page broken
              <SearchBar onSearch={handleSearch} />
            </div> */}
          </Grid>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <ul className="searchpage">
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          search_type === "artist"
                            ? item.images && item.images.length > 0
                              ? item.images[0].url
                              : ""
                            : search_type === "album"
                            ? item.images[0].url
                            : item.album.images[0].url
                        }
                        width="100px"
                        alt="NO PICTURE"
                        style={{
                          paddingRight: "20px",
                          paddingTop: "5px",
                          paddingBottom: "2px",
                          width: "80px",
                          maxHeight: "80px",
                        }}
                      />

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            paddingBottom: "5px",
                          }}
                        >
                          {item.name}
                        </span>
                        {renderContent(search_type, item)}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SearchResults;
