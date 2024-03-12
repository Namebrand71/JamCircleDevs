import React, {useEffect, useState} from 'react';
import AgoraRTC, {AgoraRTCProvider} from 'agora-rtc-react';
import VideoCall from './VideoCall';

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});

const Musicroom = () => {
  const [roomInfo, setRoomInfo] = useState([]);
  const [tokenInfo, setTokenInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/musicrooms/get-room-info`);
        if (response.ok) {
          const data = await response.json();
          console.log(data.room_name);
          console.log(data);
          setRoomInfo(data);

          // Fetch token only if room data is available
          if (data) {
            fetch(`musicrooms/get-agora-token/${encodeURIComponent(data.room_name)}/${encodeURIComponent(data.current_user_uid)}`)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
                })
                .then((data) => {
                  console.log('Token request successful:', data);
                  setTokenInfo(data);
                })
                .catch((error) => {
                  console.error('Error during token request:', error);
                  console.log('testtest');
                });
          }
        } else {
          console.error('Failed to fetch room data');
          setRoomInfo(null);
        }
      } catch (error) {
        console.error('Error fetching room data', error);
      }
    };

    fetchData();
  }, []);


  const videoCallContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Adjust the height as needed
  };

  return (
    <AgoraRTCProvider client={client}>
      {/* Other components */}
      <div style={videoCallContainerStyle}>
        {roomInfo && (
          <VideoCall
            appId={roomInfo.AGORA_ID}
            channel={roomInfo.room_name}
            token={tokenInfo.token}
            uid={roomInfo.current_user_uid}
          />
        )}
      </div>
      {/* Other components */}
    </AgoraRTCProvider>
  );
};

export default Musicroom;
