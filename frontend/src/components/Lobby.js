import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const Lobby = () => {
  const [room_name, setRoomName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [spotify_id, setCurrentSpotifyId] = useState("");
  const [showLobby, setShowLobby] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  const { accessToken } = useAuth();
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const loadProfile = () => {
    fetch("/auth/profile/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCurrentSpotifyId(data.id);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };


  const handleCreateRoom = async () => {
    // Logic to create a room...
    const apiBaseUrl = "musicrooms";
    const endpoint = "create-room";
    console.log(room_name);
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_name }),
    });

    if (response.ok) {
      window.location.href = '/musicroom';
    } else {
      // Handle error
      console.error("Failed to create room");
    }
  };

  const handleJoinRoom = async () => {
    // Logic to join a room...
    const apiBaseUrl = "musicrooms";
    const endpoint = "join-room";
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_name, passcode, spotify_id }),
    });

    if (response.ok) {
      window.location.href = '/musicroom';
    } else {
      // Handle error
      console.error("Failed to join room");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center', backgroundColor: 'black', p: 3, borderRadius: 2 }}>
      {showLobby && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            Static Text for Testing
          </Typography>
          <Button variant="contained" color="primary" sx={{ m: 1 }} onClick={() => { setShowCreateRoom(true); setShowJoinRoom(false); }}>
            Create Room
          </Button>
          <Button variant="contained" color="secondary" onClick={() => { setShowJoinRoom(true); setShowCreateRoom(false); }}>
            Join Room
          </Button>
        </Box>
      )}

      {showCreateRoom && (
        <Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Room Name"
            value={room_name}
            onChange={(e) => setRoomName(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />
          <Button variant="contained" color="primary" onClick={handleCreateRoom}>
            Create Room
          </Button>
        </Box>
      )}

      {showJoinRoom && (
        <Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Room Name"
            value={room_name}
            onChange={(e) => setRoomName(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />
          <Button variant="contained" color="primary" onClick={handleJoinRoom}>
            Join Room
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Lobby;
