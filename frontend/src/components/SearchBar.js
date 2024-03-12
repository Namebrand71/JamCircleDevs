import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({onSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('track');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchType}/${searchQuery}`);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="SearchBar">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="search-type-dropdown"
      >
        <option value="track">Track</option>
        <option value="artist">Artist</option>
        <option value="album">Album</option>
      </select>
      <input
        type="text"
        name="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button variant="contained" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
