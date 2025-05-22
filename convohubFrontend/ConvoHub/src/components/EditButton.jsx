// EditButton.js
import React, { useState } from "react";
import EditRoomModal from "./EditRoomModal"; // Modal for editing room

const EditButton = ({ room, onUpdateRoom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        className="text-white bg-blue-500 px-6 py-2 ml-10 rounded-full"
        onClick={openModal}
      >
        Edit Room
      </button>
      {isModalOpen && (
        <EditRoomModal
          room={room}
          onClose={closeModal}
          onUpdateRoom={onUpdateRoom}
        />
      )}
    </div>
  );
};

export default EditButton;