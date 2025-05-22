import React from "react";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton = () => {
  const { token, setToken } = useAuth(); // Access token and setToken from context

  const handleLogout = async () => {
    if (!token) {
      alert("No access token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.meta.message); // "Successfully logged out."
        setToken(null); // Clear token in context
        window.location.href = "/login"; // Redirect to login page
      } else {
        alert(result.meta.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
