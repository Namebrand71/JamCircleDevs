
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

const FriendsPage = () => {
  const { spotify_id } = useParams();
  const [results, setResults] = useState([]);
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
    let endpoint = `/users/get-users-friends/${spotify_id}/`;

    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(data.friends_list)

    setResults(data.friends_list);

    setLoading(false);
  };

  const renderContent = (item) => {
    // Assuming each item in results has profile_picture_url and display_name
    return (
      <div>
        <img src={item.profile_picture_url} alt="Profile" style={{ width: "50px", height: "50px" }} />
        <span>{item.display_name}</span>
      </div>
    );
  };

  return (
    <div className="friendspage">
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
          <h2>{spotify_id} Friends</h2>
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <div>
              {results && results.length > 0 ? (
                <ul>
                  {results.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={`/user/${item.spotify_id}`}
                        style={{ textDecoration: "none", color: "black" }}
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
    </div>
  );
};

export default FriendsPage;