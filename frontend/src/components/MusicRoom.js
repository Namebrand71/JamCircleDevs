import React, { useState, useEffect } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import VideoCall from "./VideoCall";
import SpotifyPlayer from "react-spotify-web-playback";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Grid, Button, TextField } from "@mui/material";

const Musicroom = () => {
  const navigate = useNavigate();
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  const [roomInfo, setRoomInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [spotifyContentId, setSpotifyContentId] = useState(
    "6uLMxmK9MHb6fiecxn2yrp"
  );
  const [spotifyIsHost, setSpotifyIsHost] = useState(false);
  const [spotifyLayout, setSpotifyLayout] = useState("responsive");
  const { accessToken } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [spotify_id, setSpotifyId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/musicrooms/get-room-info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ spotify_id }),
        });
        if (response.ok) {
          const data = await response.json();
          setRoomInfo(data);

          if (data.host_id === data.current_user_id) {
            setSpotifyIsHost(true);
            setSpotifyLayout("responsive");
          }

          if (data) {
            const agoraTokenResponse = await fetch(
              `musicrooms/get-agora-token/${encodeURIComponent(
                data.room_name
              )}/${encodeURIComponent(data.current_user_uid)}`
            );
            if (!agoraTokenResponse.ok) {
              throw new Error(
                `HTTP error! Status: ${agoraTokenResponse.status}`
              );
            }
            const agoraTokenData = await agoraTokenResponse.json();
            setTokenInfo(agoraTokenData);
          }
        } else {
          console.error("Failed to fetch room data");
          setRoomInfo(null);
        }
      } catch (error) {
        console.error("Error fetching room data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Prevent the default behavior
      event.preventDefault();
      // Call leaveRoom
      leaveRoom();
    };

    // Attach the event listener to the window
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoadingSearch(true);
      setTimeout(1000);
      const endpoint = `/auth/search_spotify_tracks/${encodeURIComponent(
        searchQuery
      )}/`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setSearchResults(data.tracks.items);
    } catch (error) {
      console.error("Error fetching search results", error);
    } finally {
      setLoadingSearch(false);
      setSearchQuery("");
    }
  };

  const handleSearchResultClick = (itemId) => {
    setSpotifyContentId(itemId);
  };

  const leaveRoom = async () => {
    try {
      const response = await fetch(`/musicrooms/leave-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_name: roomInfo.room_name }),
      });

      if (response.ok) {
        console.log("Left room successfully");
        // Redirect to /lobby
        navigate("/lobby");
      } else {
        console.error("Failed to leave room");
      }
    } catch (error) {
      console.error("Error leaving room", error);
    }
  };

  const videoCallContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  return (
    <>
      <div>
        <Grid
          container
          spacing={4}
          columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
          style={{ marginLeft: "220px" }}
        >
          <Grid
            item
            xs={20}
            sm={20}
            md={20}
            lg={20}
            xl={20}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
            }}
          >
            {roomInfo && tokenInfo && (
              <div style={{ marginLeft: "250px" }}>
                <div>
                  <h2>Room Name: {roomInfo.room_name}</h2>
                </div>
                <div>
                  <h3>Passcode: {roomInfo.passcode}</h3>
                </div>
                <AgoraRTCProvider client={client}>
                  <div style={videoCallContainerStyle}>
                    <VideoCall
                      appId={roomInfo.AGORA_ID}
                      channel={roomInfo.room_name}
                      token={tokenInfo.token}
                      uid={roomInfo.current_user_uid}
                    />
                  </div>
                </AgoraRTCProvider>
              </div>
            )}
          </Grid>

          <form onSubmit={handleSearch} autoComplete="off">
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

          <div>
            {loadingSearch && <p>Loading...</p>}
            {!loadingSearch && searchResults.length === 0 && (
              <p>No results found.</p>
            )}
            {!loadingSearch && searchResults.length > 0 && (
              <ul>
                {searchResults.map((result) => (
                  <li
                    key={result.id}
                    onClick={() => handleSearchResultClick(result.id)}
                  >
                    <div>
                      <p>{result.name}</p>
                      <img src={result.album.images[0].url} alt={result.name} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Grid
            item
            xs={20}
            sm={20}
            md={20}
            lg={20}
            xl={20}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <button onClick={leaveRoom}>Leave Room</button>
            </div>
            <div style={{ marginRight: "20px" }}>
              <SpotifyPlayer
                token={accessToken}
                uris={
                  spotifyContentId ? [`spotify:track:${spotifyContentId}`] : []
                }
                layout={spotifyLayout}
                hideAttribution={true}
                styles={{
                  activeColor: "#fff",
                  bgColor: "#333",
                  color: "#fff",
                  loaderColor: "#fff",
                  sliderColor: "#1cb954",
                  trackArtistColor: "#ccc",
                  trackNameColor: "#fff",
                }}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Musicroom;
