import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import MainLayout from "./layouts/MainLayout";
import RoomPage from "./pages/RoomPage"; 
import { AuthProvider } from "./contexts/AuthContext"; // Import the AuthProvider
import ProtectedRoute from "./components/ProtectedRoute"
import ProfessorReviewPage from "./pages/ProfessorReviewPage";
const App = () => {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/main" element={<ProtectedRoute> <MainPage /> </ProtectedRoute>} />
            <Route path="/rooms/:roomId/" element={<ProtectedRoute> <RoomPage /> </ProtectedRoute>} />
            <Route path="/professor-review/:professor/:course" element={<ProtectedRoute> <ProfessorReviewPage /> </ProtectedRoute>} />
            <Route path="/" element={<LoginPage />} />

           {/* PUT ALL PAGES THAT SHOULD NOT BE
            GIVEN ACCESS WITHOUT LOGIN IN PROTECTED ROUTE COMPONENT*/}
      
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;



