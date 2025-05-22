import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SearchRoom = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const { token } = useAuth(); // Get token from context

  useEffect(() => {
    const fetchRooms = async () => {
      if (!token || !searchTerm) {
        setError("Search term cannot be empty.");
        console.warn("Search term is empty or token is missing.");
        return;
      }
  
      // Clear error when initiating a new search
      setError("");
      try {
        console.log("Fetching rooms with searchTerm:", searchTerm);
        const response = await fetch(
          `http://127.0.0.1:8000/rooms/search/?query=${encodeURIComponent(searchTerm)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log("Fetch response status:", response.status);
  
        if (response.ok) {
          const data = await response.json();
          console.log("API response data:", data);
  
          if (data.data && data.data.length > 0) {
            setRooms(
              data.data.map((room) => ({
                roomId: room.room_id,
                title: room.room_name,
                description: room.description,
                topic: room.topic,
              }))
            );
            console.log("Rooms fetched successfully.");
          } else {
            setRooms([]);
            setError("No matching rooms found.");
            console.warn("No rooms matching the search term.");
          }
        } else {
          let errorMessage = "An error occurred while fetching rooms.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            console.error("API error response:", errorData);
          } catch (jsonError) {
            console.error("Failed to parse error response:", jsonError);
          }
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error.message || "Failed to load rooms. Please try again later.");
      }
    };
  
    if (searchTerm) {
      fetchRooms(); // Call fetchRooms when searchTerm changes
    } else {
      setRooms([]); // Reset rooms when searchTerm is empty
      setError(""); // Clear error if search term is cleared
    }
  }, [searchTerm, token]); // Dependency array ensures useEffect runs when searchTerm or token changes
   // Dependency array ensures useEffect runs when searchTerm or token changes

  const handleSearchChange = (event) => {
    console.log("Search term updated:", event.target.value);
    setSearchTerm(event.target.value);
  };

  const closeModal = () => {
    console.log("Modal closed.");
    setIsModalOpen(false);
    setSearchTerm(""); // Reset the search term
    setRooms([]); // Clear the rooms list
    setError(""); // Clear any error message
  };  

  return (
    <div>
      <Button label="Search Room" onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[#1E1E1E] bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative rounded-2xl p-6 w-1/3 bg-[#1E1E1E]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white font-bold text-2xl w-8 h-8 flex justify-center items-center bg-gray-500 rounded-full"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white text-center mb-4">Search Room</h2>

            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Enter Room Name"
                className="bg-[#3B3B3B] w-full p-3 pr-10 pl-4 rounded-full text-white"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <i className="fa fa-search"></i>
              </span>
            </div>

            {error ? (
              <p className="text-red-500 mt-2">{error}</p>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <div className="border-t py-2" key={room.roomId}>
                  <Link
                    to={`/rooms/${room.roomId}`} // Corrected the Link URL syntax
                    className="text-white text-left block"
                  >
                    {room.title} 
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-white mt-2">Type in the search bar to look for a room.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchRoom;
