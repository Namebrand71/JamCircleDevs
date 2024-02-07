// SearchResults.js
import React, { useEffect, useState } from "react";

const SearchResults = ({ location }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Assuming the query parameters are passed via the location prop
    const searchQuery = new URLSearchParams(location.search).get("query");
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  }, [location.search]);

  const fetchSearchResults = async (query) => {
    const response = await fetch(
      `/api/search/?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    setResults(data.tracks.items); // Adjust based on the actual response structure
  };

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((item, index) => (
          <li key={index}>
            {item.name} - {item.artists[0].name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
