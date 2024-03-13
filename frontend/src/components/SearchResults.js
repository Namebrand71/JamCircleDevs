import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

    {
      /* sets results to data depending on type */
    }
    if (type === "track") {
      setResults(data.tracks.items);
    } else if (type === "album") {
      setResults(data.albums.items);
    } else if (type === "artist") {
      setResults(data.artists.items);
    }

    setLoading(false);
  };

  {
    /* Render content based on type */
  }
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

  return (
    <Grid
      container
      spacing={1}
      columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
    >
      {/* Navbar Grid item */}
      <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
        {/* <Navbar /> */}
      </Grid>

      {/* Content Grid item */}
      <Grid item xs={4} sm={4} md={8} lg={16} xl={16}>
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={12} className="SearchResultsHeading">
            {/* Header */}
            <div id="Head">
              {/* Back button */}
              <Link to="/profile" id="Back">
                <Button variant="contained">Go Back</Button>
              </Link>
              {/* Search info title */}
              <div id="Title">
                <h2>Search Results for "{decodeURIComponent(search_query)}"</h2>
              </div>
            </div>
          </Grid>

          {/* Load results */}
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <ul>
              {results.map((item, index) => (
                <li key={index} className="ListItem">
                  {/* Link to review page */}
                  <Link
                    to={
                      search_type === "track"
                        ? `/song/${item.id}`
                        : `/${search_type}/${item.id}`
                    }
                    id="Item"
                  >
                    <div id="ItemContent">
                      {/* Display corresponding image */}
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
                        alt="NO PICTURE"
                      />

                      {/* Display name */}
                      <div id="Name">
                        <span>{item.name}</span>
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
