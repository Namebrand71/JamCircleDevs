import React, {useState} from 'react';

const Lobby = () => {
  const [room_name, setRoomName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showLobby, setShowLobby] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const handleCreateRoom = async () => {
    // Logic to create a room...
    const apiBaseUrl = 'musicrooms';
    const endpoint = 'create-room';
    console.log(room_name);
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({room_name}),
    });

    if (response.ok) {
      window.location.href = '/musicroom';
    } else {
      // Handle error
      console.error('Failed to create room');
    }
  };

  const handleJoinRoom = async () => {
    // Logic to join a room...
    const apiBaseUrl = 'musicrooms';
    const endpoint = 'join-room';
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({room_name, passcode}),
    });

    if (response.ok) {
      // Redirect to the joined room
    } else {
      // Handle error
      console.error('Failed to join room');
    }
  };

  return (
    <div style={{textAlign: 'center', marginTop: '50px', marginLeft: '300px', backgroundColor: 'black'}}>
      {showLobby && (
        // Lobby Page
        <div>
          <p>Static Text for Testing</p>
          <br />
          <button onClick={() => setShowCreateRoom(true)}>Create Room</button>
          <br />
          <button onClick={() => setShowJoinRoom(true)}>Join Room</button>
        </div>
      )}

      {showCreateRoom && (
        // Create Room Page
        <div>
          <input
            type="text"
            placeholder="Room Name"
            value={room_name}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <br />
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>
      )}

      {showJoinRoom && (
        // Join Room Page
        <div>
          <input
            type="text"
            placeholder="Room Name"
            value={room_name}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <br />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default Lobby;
