import React, { useState } from "react";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';

const DeleteRoom = ({ rooms, onDelete }) => {
  const [roomName, setRoomName] = useState("");
  const [roomTopic, setRoomTopic] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token } = useAuth();

  const handleDeleteRoom = async () => {
    const roomToDelete = rooms.find(
      (room) =>
        room.title.toLowerCase() === roomName.toLowerCase() &&
        room.topic.toLowerCase() === roomTopic.toLowerCase() &&
        (roomDescription
          ? room.description.toLowerCase() === roomDescription.toLowerCase()
          : true)
    );

    if (roomToDelete) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/rooms/${roomToDelete.roomId}/`, // Use roomId for the backend endpoint
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token for authentication
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          toast.success(`Room "${roomToDelete.title}" has been deleted!`);
          onDelete(roomToDelete); // Remove the room from the frontend state
          setRoomName("");
          setRoomTopic("");
          setRoomDescription("");
        } else if (response.status === 403 || response.status===401) {
          toast.error("Only room creators can delete the room!");
        } else {
          const result = await response.json();
          throw new Error(result.message || "Failed to delete the room.");
        }
      } catch (err) {
        console.error("Error deleting room:", err);
        toast.error(err.message || "An error occurred. Please try again.");
      }
    } else {
      toast.error("No matching room found. Please check your input.");
    }

    setIsModalOpen(false);
  };

  const closeModal = () => {
    setRoomName("");
    setRoomTopic("");
    setRoomDescription("");
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button label="Delete Room" onClick={() => setIsModalOpen(true)} />

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
            <h2 className="text-xl font-bold text-white text-center mb-4">
              Delete Room
            </h2>

            <div className="mb-4">
              <label className="text-white text-left block mb-2">Room Name</label>
              <input
                type="text"
                className="bg-[#3B3B3B] w-full p-3 pr-10 pl-4 rounded-full text-white"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="text-white text-left block mb-2">Topic</label>
              <input
                type="text"
                className="bg-[#3B3B3B] w-full p-3 pr-10 pl-4 rounded-full text-white"
                value={roomTopic}
                onChange={(e) => setRoomTopic(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="text-white text-left block mb-2">
                Description (Optional)
              </label>
              <textarea
                className="bg-[#3B3B3B] w-full p-3 pr-10 pl-4 rounded-full text-white"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                placeholder="Enter room description (optional)"
                rows="2"
              />
            </div>

            <div className="flex justify-end mt-2">
              <button
                className="text-white text-right py-2 px-6 rounded-lg bg-red-500 hover:bg-red-600 transition duration-300"
                onClick={handleDeleteRoom}
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteRoom;

