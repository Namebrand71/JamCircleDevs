import React, { useState } from "react";

const SendFriendRequest = ({ spotify_id }) => {
  const [requestSent, setRequestSent] = useState(false);

  const sendFriendRequest = async () => {
    try {
      const response = await fetch(`/users/send-friend-request/${spotify_id}`);

      if (response.ok) {
        setRequestSent(true);
      } else {
        console.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const cancelFriendRequest = async () => {
    try {
      const response = await fetch(
        `/users/cancel-friend-request/${spotify_id}`
      );

      if (response.ok) {
        setRequestSent(false);
      } else {
        console.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div>
      {!requestSent && (
        <button onClick={sendFriendRequest}>Send Friend Request</button>
      )}
      {requestSent && (
        <button onClick={cancelFriendRequest}>Cancel Friend Request</button>
      )}
    </div>
  );
};

export default SendFriendRequest;
