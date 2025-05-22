import React from "react";

const Button = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#D9D9D980] text-white px-8 py-2 rounded-full hover:bg-gray-700 focus:outline-none shadow-md transition-all duration-300 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
