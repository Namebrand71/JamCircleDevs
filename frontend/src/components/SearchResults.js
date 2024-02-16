import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

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
    console.log(data.tracks.items);
    setLoading(false);
  };

  // if (loading) return <div>Loading...</div>;

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
              {results.map((track, index) => (
                <li key={index}>
                  <Link
                    to={`/song/${track.id}`}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {track.name} by{" "}
                    {track.artists.map((artist) => artist.name).join(", ")}
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
