import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const RoomCard = ({ roomId, title, topic, creator }) => {
  const [membersCount, setMembersCount] = useState(null);
  const { token } = useAuth();
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/rooms/${roomId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Set the members count from the response
          setMembersCount(data.data.room.members.length);
        } else {
          console.error("Error fetching room details:", data);
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  return (
    <div className="relative w-[280px] h-[170px] bg-gradient-to-b from-[#2E2256] to-[#2E2256] border border-white rounded-[20px] shadow-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105">
      {/* Room details */}
      <div className="text-white font-bold text-lg mb-2">{title}</div>
      <div className="text-white text-sm mb-6">
        <p>{topic}</p>
        <p>Created by: {creator}</p>
      </div>
      <hr className="border-white mb-4" />
      <div className="flex items-center justify-between text-white text-sm">
        {/* Render members count dynamically */}
        <span className="italic">
       { `${membersCount} members` }

        </span>
        <span className="text-xl">👥</span>
      </div>

      <Link to={`/rooms/${roomId}/`} className="absolute inset-0 z-10" />
    </div>
  );
};

export default RoomCard;

