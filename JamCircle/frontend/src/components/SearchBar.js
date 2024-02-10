import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../static/css/searchbar.css"; // Adjust the import path as necessary

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/track/${searchQuery}`);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <input
        type="text"
        name="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
