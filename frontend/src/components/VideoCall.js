import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useState } from "react";
import "./styles.css";
import { Grid, Button, IconButton, Tooltip, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

const VideoCall = ({ appId: initialAppId, channel: initialChannel, token: initialToken, uid: initialUID}) => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  console.log("JOIN PERAMS", initialAppId, initialChannel, initialToken, initialUID)
  useJoin({appid: initialAppId, channel: initialChannel, token: initialToken, uid: initialUID}, calling);
  //local user
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  //remote users
  const remoteUsers = useRemoteUsers();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Camera Feeds Container */}
      <Grid container spacing={2} justifyContent="center">
        {isConnected ? (
          <>
            {/* Local User */}
            <Grid item xs={12} sm={6} md={3}>
              <div className="user">
                <LocalUser
                  audioTrack={localMicrophoneTrack}
                  cameraOn={cameraOn}
                  micOn={micOn}
                  videoTrack={localCameraTrack}
                  cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                >
                  <samp className="user-name">You</samp>
                </LocalUser>
              </div>
            </Grid>
            {/* Remote Users */}
            {remoteUsers.map((user) => (
              <Grid item xs={12} sm={6} md={3} key={user.uid}>
                <div className="user">
                  <RemoteUser cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg" user={user}>
                    <samp className="user-name">{user.uid}</samp>
                  </RemoteUser>
                </div>
              </Grid>
            ))}
          </>
        ) : (
          <Grid item xs={12}>
            <Button variant="contained" onClick={() => setCalling(true)}>
              Join Channel
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Action Icons Container */}
      {isConnected && (
        <Grid container justifyContent="center" spacing={1} sx={{ marginTop: 0,marginLeft: 5 }}>
          <Grid item>
            <Tooltip title="Toggle Microphone">
              <IconButton color="primary" onClick={() => setMic((a) => !a)}>
                {micOn ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Toggle Camera">
              <IconButton color="primary" onClick={() => setCamera((a) => !a)}>
                {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title={calling ? "Hang Up" : "Call"}>
              <IconButton color="error" onClick={() => setCalling((a) => !a)}>
                {calling ? <PhoneDisabledIcon /> : <PhoneIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default VideoCall;
