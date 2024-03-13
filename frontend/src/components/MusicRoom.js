import React, { useState, useEffect } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import VideoCall from "./VideoCall";
import SpotifyPlayer from "react-spotify-web-playback";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";

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
      {roomInfo && tokenInfo && (
        <Container sx={{ marginLeft: "240px" }}>
          <Typography variant="h6" gutterBottom>
            Room Name: {roomInfo.room_name}
          </Typography>
          <Typography variant="h6">Passcode: {roomInfo.passcode}</Typography>
          <AgoraRTCProvider client={client}>
            <Box
              sx={{
                ...videoCallContainerStyle,
                backgroundColor: "#333",
                marginLeft: "240px",
              }}
            >
              {" "}
              {/* Adjust your styles accordingly */}
              <VideoCall
                appId={roomInfo.AGORA_ID}
                channel={roomInfo.room_name}
                token={tokenInfo.token}
                uid={roomInfo.current_user_uid}
              />
            </Box>
          </AgoraRTCProvider>
        </Container>
      )}

      <Container sx={{ marginLeft: "240px" }}>
        <form
          onSubmit={handleSearch}
          autoComplete="off"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <TextField
            variant="outlined"
            name="search"
            placeholder="Search..."
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Search
          </Button>
        </form>
        {loadingSearch ? (
          <CircularProgress />
        ) : searchResults.length === 0 ? (
          <Typography>No results found.</Typography>
        ) : (
          <List sx={{ bgcolor: "background.black" }}>
            {searchResults.map((result) => (
              <ListItemButton
                key={result.id}
                onClick={() => handleSearchResultClick(result.id)}
              >
                <ListItemText primary={result.name} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Container>

      <Container>
        <Button
          variant="outlined"
          onClick={leaveRoom}
          sx={{ marginTop: "20px" }}
        >
          Leave Room
        </Button>
      </Container>

      {accessToken && spotifyContentId && (
        <Box
          sx={{
            position: "fixed",
            right: 16, // Adjust the spacing from the right edge of the viewport
            bottom: 16, // Adjust the spacing from the bottom edge of the viewport
            zIndex: 1000, // Ensure it's above most other content
          }}
        >
          <SpotifyPlayer
            token={accessToken}
            uris={[`spotify:track:${spotifyContentId}`]}
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
        </Box>
      )}
    </>
  );
};

export default Musicroom;
