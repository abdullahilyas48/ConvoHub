import React, { useState } from "react";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext"; // Ensure this path matches your AuthContext location
import { toast } from "react-toastify";

const CreateRoom = ({ userName, onRoomCreated, existingRooms }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomTopic, setRoomTopic] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  
  const { token } = useAuth();

  const handleCreateRoom = async () => {
    if (!roomName || !roomTopic) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Check for duplicate rooms
    const isDuplicate = existingRooms.some(
      (room) =>
        room.title.toLowerCase() === roomName.toLowerCase() &&
        room.topic.toLowerCase() === roomTopic.toLowerCase() &&
        room.description.toLowerCase() === roomDescription.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("A room with the same name, topic, and description already exists!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/rooms/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Use token from AuthContext
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roomName,
          topic: roomTopic,
          description: roomDescription
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const newRoom = {
          roomId: result.data.id,
          title: result.data.name,
          topic: roomTopic,
          description: roomDescription,
          creator: `@${userName}`,
          members: result.data.members.length.toString(),
        }; 

        onRoomCreated(newRoom);
        setRoomName("");
        setRoomTopic("");
        setRoomDescription("");
        setIsModalOpen(false);
        toast.success("Room created successfully!");
      } else {
        throw new Error(result.meta.message || "Failed to create room");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred. Please try again.");
    }
  };

  const closeModal = () => {
    setRoomName("");
    setRoomTopic("");
    setRoomDescription("");
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        label="Create Room"
        onClick={() => setIsModalOpen(true)}
      />

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
              Create Room
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
                className="text-white text-right py-2 px-6 rounded-lg bg-green-500 hover:bg-green-600 transition duration-300"
                onClick={handleCreateRoom}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;

