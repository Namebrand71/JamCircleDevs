import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

const FriendsPage = () => {
  const { spotify_id } = useParams();
  const [results, setResults] = useState([]);
  const [userDisplayName, setUserDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (spotify_id) {
      fetchFriendsList(spotify_id);
    }
  }, [spotify_id]);

  const fetchFriendsList = async (spotify_id) => {
    setLoading(true);
    console.log(spotify_id);

    // Assuming the endpoint is correct and id is used appropriately
    let endpoint = `/users/get-user-friends/${spotify_id}`;

    const response = await fetch(endpoint);
    console.log(response);
    const data = await response.json();
    console.log(data);

    setResults(data);

    const displayresponce = await fetch(
      `/users/get-display-name/${spotify_id}/`
    );
    const data2 = await displayresponce.json();
    console.log(data2);
    setUserDisplayName(data2);

    setLoading(false);
  };

  const renderContent = (item) => {
    // Assuming each item in results has profile_picture_url and display_name
    return (
      <div>
        <img
          src={item.profile_pic_url}
          alt="Profile"
          style={{ width: "50px", height: "50px" }}
        />
        <span>{item.display_name}</span>
      </div>
    );
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
              <h2>{userDisplayName}'s Friends</h2>
            </div>
          </Grid>
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <div>
              {results && results.length > 0 ? (
                <ul className="searchpage">
                  {results.map((item, index) => (
                    <li key={index} className="list-item">
                      <Link
                        to={`/user/${item.spotify_id}`}
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        {renderContent(item)}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No friends found.</p>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FriendsPage;
