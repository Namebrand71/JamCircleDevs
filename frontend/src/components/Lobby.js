import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Grid, Button, TextField } from "@mui/material";

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
      window.location.href = "/musicroom";
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
      window.location.href = "/musicroom";
    } else {
      // Handle error
      console.error("Failed to join room");
    }
  };

  return (
    <Grid
      container
      spacing={4}
      columns={{ xs: 4, sm: 8, md: 12, lg: 20, xl: 20 }}
    >
      <Grid
        item
        xs={20}
        sm={20}
        md={20}
        lg={20}
        xl={20}
        style={{
          paddingLeft: "220px",
          textAlign: "center",
          fontSize: "2rem",
        }}
      >
        <h1>Music Rooms</h1>
      </Grid>

      {/* Make space for the Navbar */}
      <Grid item xs={8} sm={6} md={0} lg={3} xl={0}>
        {/* <Navbar /> */}
      </Grid>

      <Grid item xs={4} sm={6} md={9} lg={9} xl={12}>
        {showLobby && (
          // Lobby Page
          <Grid
            container
            spacing={2}
            alignItems="center"
            justify="center"
            style={{
              marginLeft: "180px",
              marginTop: "100px",
            }}
          >
            <Grid
              item
              xs={6}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  setShowCreateRoom(true);
                  setShowJoinRoom(false);
                }}
                style={{ width: "180px" }}
              >
                Create Room
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  setShowJoinRoom(true);
                  setShowCreateRoom(false);
                }}
                style={{ width: "180px" }}
              >
                Join Room
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {showCreateRoom && (
                // Create Room Page
                <div style={{ marginTop: "100px" }}>
                  <div>
                    <TextField
                      placeholder="Room Name"
                      fullWidth
                      required
                      value={room_name}
                      onChange={(e) => setRoomName(e.target.value)}
                      sx={{
                        width: "500px",
                        backgroundColor: "white",
                        marginBottom: "20px",
                      }}
                    />
                  </div>
                  <div>
                    <Button variant="contained" onClick={handleCreateRoom}>
                      Create Room
                    </Button>
                  </div>
                </div>
              )}

              {showJoinRoom && (
                // Join Room Page
                <div style={{ marginTop: "100px" }}>
                  <div>
                    <TextField
                      fullWidth
                      placeholder="Room Name"
                      required
                      value={room_name}
                      onChange={(e) => setRoomName(e.target.value)}
                      sx={{
                        width: "500px",
                        backgroundColor: "white",
                        marginBottom: "20px",
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      placeholder="Passcode"
                      required
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      sx={{
                        width: "500px",
                        backgroundColor: "white",
                        marginBottom: "20px",
                      }}
                    />
                  </div>
                  <div style={{ alignContent: "center" }}>
                    <Button variant="contained" onClick={handleJoinRoom}>
                      Join Room
                    </Button>
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Lobby;
