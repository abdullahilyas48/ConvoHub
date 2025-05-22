import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ConvoHub from "../components/ConvoHub";
import UserProfile from "../components/UserProfile";
import avatarImage from "../assets/images/avatar.png";
import EditButton from "../components/EditButton";

const RoomPage = () => {
  const { roomId } = useParams();
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roomUpdateTrigger, setRoomUpdateTrigger] = useState(false);
  const socketRef = useRef(null);

  // Fetch room details
  const fetchRoomDetails = async () => {
    try {
      console.log("Fetching room details for roomId:", roomId);
      const response = await fetch(`http://127.0.0.1:8000/rooms/${roomId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Room details fetched successfully:", data.data);
        setRoom(data.data.room);
        setMessages(data.data.messages || []); // Set initial messages
        // Retrieve join status from localStorage or check membership
        const savedJoinStatus = localStorage.getItem(`joined_${roomId}`) === "true";
        const isUserJoined = savedJoinStatus || data.data.room.members.some(
          (member) => member.username === user
        );
        setJoined(isUserJoined);
      } else {
        console.error("Error fetching room details:", data);
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    } finally {
      setIsLoading(false);
    }
  };


  // Fetch room details when user or token changes
  useEffect(() => {
    if (user && token) {
      fetchRoomDetails();
    }
  }, [user, token, roomId, roomUpdateTrigger]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        try {
          const response = await fetch("http://127.0.0.1:8000/profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();

          if (response.ok) {
            setUser(data.data.username);
          } else {
            console.error("Failed to fetch user details:", data);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [token]);

  useEffect(() => {
    if (joined && token) {
      const socketUrl = `ws://127.0.0.1:8000/ws/chat/${roomId}/?token=${token}`;
      socketRef.current = new WebSocket(socketUrl);
      socketRef.current.onopen = () => {
        console.log("Connected to WebSocket");
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.message) {
            console.log("Previous messages:", messages); // Log current state of messages
            console.log("New message received from WebSocket:", data.message); // Log the incoming WebSocket message
            setMessages((prevMessages) => {
            [...prevMessages, data.message];
            fetchRoomDetails(); // Added this line
              // console.log("Updated messages array after adding new message:", updatedMessages); // Verify the new array
            
              // // Save updated messages to localStorage
              // localStorage.setItem(messages_${roomId}, JSON.stringify(updatedMessages));
            
              // return updatedMessages;
            });
            
          }
          else {
            console.warn("Received unknown message format:", data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socketRef.current.onclose = (event) => {
        if (event.wasClean) {
          console.log("WebSocket connection closed cleanly");
        } else {
          console.warn("WebSocket connection closed unexpectedly");
        }
        console.log("WebSocket close event:", event);
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket encountered an error:", error);
      };

      return () => {
        console.log("Closing WebSocket connection");
        socketRef.current.close();
      };
    }
  }, [joined, token, roomId]);
  // Fetch user details
 
  useEffect(() => {
    console.log("Updated messages state:", messages);
  }, [messages]);
  
  // Handle join room action
  const handleJoinRoom = async () => {
    if (!joined) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/rooms/${roomId}/join/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          await fetchRoomDetails(); // Re-fetch room details after joining
          setJoined(true);
          localStorage.setItem(`joined_${roomId}, "true"`); // Save join status in localStorage
        } else {
          const errorData = await response.json();
          console.error("Failed to join the room:", errorData);
        }
      } catch (error) {
        console.error("Error while joining the room:", error);
      }
    }
  };

  const handleRoomUpdate = (updatedRoom) => {
    console.log("Room updated:", updatedRoom);
    setRoom(updatedRoom); // Update the room state locally
    setRoomUpdateTrigger((prev) => !prev); // Trigger re-fetch for updated details
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: newMessage }));
      setNewMessage("");
      await fetchRoomDetails();
    }
  };


  if (isLoading || !room || !user) {
    return <p>Loading room details...</p>;
  }

  return (
    <div className="room-page">
      <div className="absolute top-4 left-[40%] transform -translate-x-1/2 z-10">
        <ConvoHub />
      </div>
      <div className="absolute top-4 right-16 z-10">
        <UserProfile username={user} avatar={avatarImage} />
      </div>

      <div className="flex justify-center mt-40 px-6 relative">
      <div className="flex-1 bg-[#282853] rounded-3xl p-6 border border-white mr-40 w-[700px] h-[600px] relative z-10">
          <div className="relative flex items-center justify-between mb-6">
            <h1 className="text-white text-3xl font-bold">{room.name}</h1>
            <button
              onClick={handleJoinRoom}
              className="text-white bg-green-500 px-6 py-2 rounded-full ml-20"
              disabled={joined}
            >
              {joined ? "Joined" : "Join"}
            </button>
            {room.host?.username === user && (
              <EditButton room={room} onUpdateRoom={handleRoomUpdate} />
            )}
          </div>
          <p className="text-white mt-2 font-bold">{room.topic}</p>
          <p className="text-white mt-2">{room.description}</p>
        </div>
        
        <div className="absolute top-[130px] left-[5px] mt-6 p-6  rounded-3xl w-[700px] h-[200px] ml-[20px] z-20">
        <h2 className="text-white font-bold text-xl mb-4">Chat</h2>
        <div className="h-[300px] overflow-y-auto  p-4 rounded-lg mb-4">
          {Array.isArray(messages) && messages.map((msg, index) => (
            <p key={msg.id || index} className="text-white">
               <strong>{msg.user.username}:</strong> {msg.content}
            </p>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 rounded-l-lg"
            value= {newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-500 text-white px-4 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>

        <div className="w-[300px] bg-[#282853] rounded-3xl p-6">
          <h2 className="text-white font-bold text-xl mb-4 text-center">Members</h2>
          <div className="h-[300px] overflow-y-auto">
            {room.members.map((member, index) => {
              const profileImage = member.profile_image
                ? `http://127.0.0.1:8000${member.profile_image}`
                : avatarImage;

              return (
                <div key={index} className="flex items-center mb-2 text-gray-300">
                  <img
                    src={profileImage}
                    alt={member.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{member.username}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
