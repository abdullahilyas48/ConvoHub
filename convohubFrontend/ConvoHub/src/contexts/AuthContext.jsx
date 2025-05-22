import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("token") || null; // Fetch token from sessionStorage
  });

  const saveToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      sessionStorage.setItem("token", newToken); // Save token to sessionStorage
    } else {
      sessionStorage.removeItem("token"); // Remove token on logout
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken: saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
