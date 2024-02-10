import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

const ReturnedResults = ({ results, search_query }) => {
  return (
    <Grid item xs={6}>
      <h2>Search Results for "{decodeURIComponent(search_query)}"</h2>
      <ul>
        {results.map((track, index) => (
          <li key={index}>
            <Link
              to={`/song/${track.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {track.name} by{" "}
              {track.artists.map((artist) => artist.name).join(", ")}
            </Link>
          </li>
        ))}
      </ul>
    </Grid>
  );
};

const SearchResults = () => {
  const { search_query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search_query) {
      fetchSearchResults(search_query);
    }
  }, [search_query]);

  const fetchSearchResults = async (query) => {
    setLoading(true);
    const response = await fetch(
      `/auth/search_spotify_tracks/${encodeURIComponent(query)}/`
    );
    const data = await response.json();
    setResults(data.tracks.items);
    setLoading(false);
  };

  return (
    <div className="searchpage">
      <Grid container spacing={1} alignItems={"flex-start"}>
        <Grid item xs={12} align="right">
          <Navbar />
        </Grid>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <ReturnedResults results={results} search_query={search_query} />
        )}
      </Grid>
    </div>
  );
};

export default SearchResults;
