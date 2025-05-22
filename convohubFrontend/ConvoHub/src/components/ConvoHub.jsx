import React from "react";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const ConvoHub = ({ currentPage }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (currentPage !== "login" && currentPage !== "signup") {
      // Redirect to main page
      navigate("/main");
    }
  };
  return (
    <div onClick={handleClick} className="cursor-pointer">
    <div className="flex items-start justify-start bg-gradient-to-b from-purple-1500 to-purple-1000">
      {/* Left-Aligned Logo Section */}
      <div className="p-4">
        <img
          src={logo}
          alt="ConvoHub Logo"
          className="h-20 w-auto"
        />
      </div>
    </div>
    </div>
  );
};

export default ConvoHub;