import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ConvoHub from "../components/ConvoHub";
import UserProfile from "../components/UserProfile";
import RoomCard from "../components/RoomCard";
import CreateRoom from "../components/CreateRoom";
import ProfessorReviews from "../components/ProfessorReviews";
import DeleteRoom from "../components/DeleteRoom";
import SearchRoom from "../components/SearchRoom";
import RecentActivities from "../components/RecentActivities"; // Import RecentActivities
import { useAuth } from "../contexts/AuthContext";

const MainPage = () => {
  const location = useLocation();
  const [rooms, setRooms] = useState(() => {
    const storedRooms = localStorage.getItem("rooms");
    return storedRooms ? JSON.parse(storedRooms) : [];
  });
  const [username, setUsername] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.data.username) {
          setUsername(data.data.username);
        } else {
          console.error("Username not found in API response");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUsername();
  }, [token]);

  const generateRoomId = (rooms) => {
    const maxRoomId = Math.max(
      ...rooms.map((room) => parseInt(room.roomId.replace("room", ""))),
      4
    );
    return `room${maxRoomId + 1}`;
  };

  const handleRoomCreated = (newRoom) => {
    setRooms((prevRooms) => {
      const existingRoom = prevRooms.find(
        (room) => room.title === newRoom.title || room.topic === newRoom.topic
      );

      if (existingRoom) {
        newRoom.roomId = existingRoom.roomId;
      } else {
        newRoom.roomId = newRoom.roomId || generateRoomId(prevRooms);
      }

      return [...prevRooms, newRoom];
    });
  };

  const handleDeleteRoom = (roomToDelete) => {
    localStorage.removeItem(`joined_${roomToDelete.roomId}`);
    setRooms((prevRooms) =>
      prevRooms.filter(
        (room) =>
          room.roomId !== roomToDelete.roomId ||
          room.title.toLowerCase() !== roomToDelete.title.toLowerCase() ||
          room.topic.toLowerCase() !== roomToDelete.topic.toLowerCase() ||
          (roomToDelete.description
            ? room.description.toLowerCase() !== roomToDelete.description.toLowerCase()
            : false)
      )
    );
  };

  useEffect(() => {
    if (location.state && location.state.joinedRoom) {
      const newRoom = location.state.joinedRoom;
      setRooms((prevRooms) => {
        const roomExists = prevRooms.some(
          (room) => room.title === newRoom.title && room.topic === newRoom.topic
        );

        if (!roomExists) {
          const newRoomId = `room${prevRooms.length + 1}`;
          return [...prevRooms, { ...newRoom, roomId: newRoomId }];
        }
        return prevRooms;
      });
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  return (
    <div className="min-h-screen font-josefin">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-26 py-4 relative">
        <ConvoHub currentPage="main" />
        <div className="flex flex-col items-start">
          <UserProfile />
          <div className="mt-7 ml-8">
          </div>
        </div>
      </div>

      <div className="flex max-w-9xl mx-auto mt-6 space-x-8">
        <div className="font-bold w-3/4 pr-6">
          {/* Buttons */}
          <div className="flex space-x-7 mb-8">
            <SearchRoom allRooms={rooms} />
            <CreateRoom userName={username} onRoomCreated={handleRoomCreated} existingRooms={rooms} />
            <ProfessorReviews />
            <DeleteRoom rooms={rooms} onDelete={handleDeleteRoom} />
          </div>

          {/* Room Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <Link
                  key={room.roomId}
                  to={`/rooms/${room.roomId}`}
                  className="block"
                >
                  <RoomCard
                    roomId={room.roomId}
                    title={room.title}
                    topic={room.topic}
                    creator={room.creator}
                    members={room.members}
                  />
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center p-6 bg-gray-800 rounded-lg shadow-md">
                <p className="text-xl font-semibold text-white mb-4">You haven't joined any rooms yet.</p>
                <p className="text-md text-white">Start by searching for an existing room or creating a new one!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-gradient-to-b from-[#38386FB2] to-[#23243AB2] rounded-2xl p-4 h-[460px] shadow-md w-[35%] overflow-y-auto">
          <RecentActivities token={token} limit={10} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;