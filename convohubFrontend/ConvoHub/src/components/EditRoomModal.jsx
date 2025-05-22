import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const EditRoomModal = ({ room, onClose, onUpdateRoom }) => {
  const [roomName, setRoomName] = useState(room?.name || "");
  const [roomTopic, setRoomTopic] = useState(room?.topic || "");
  const [roomDescription, setRoomDescription] = useState(room?.description || "");
  const { token } = useAuth();

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/rooms/${room.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: roomName,
          topic: roomTopic,
          description: roomDescription,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Room updated successfully:", result.data.room);
        onUpdateRoom(result.data.room); // Update the room in parent component
        onClose(); // Close the modal
      } else {
        console.error("Failed to update room:", result.meta.message || result);
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#1E1E1E] bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="relative rounded-2xl p-6 w-1/3 bg-[#1E1E1E]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          className="absolute top-2 right-2 text-white font-bold text-2xl w-8 h-8 flex justify-center items-center bg-gray-500 rounded-full"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-white text-center mb-4">
          Edit Room
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
          <label className="text-white text-left block mb-2">Description</label>
          <textarea
            className="bg-[#3B3B3B] w-full p-3 pr-10 pl-4 rounded-full text-white"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
            placeholder="Enter room description"
            rows="2"
          />
        </div>

        <div className="flex justify-end mt-2">
          <button
            className="text-white py-2 px-6 rounded-lg bg-gray-500 hover:bg-gray-600 transition duration-300 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="text-white py-2 px-6 rounded-lg bg-green-500 hover:bg-green-600 transition duration-300"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;

