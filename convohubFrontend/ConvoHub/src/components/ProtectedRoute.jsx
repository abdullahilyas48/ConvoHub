import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Replace with the correct path to your AuthContext

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth(); // Check if the user is logged in

  if (!token) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;
