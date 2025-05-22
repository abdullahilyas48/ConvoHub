import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConvoHub from "../components/ConvoHub";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext"; // Import the custom hook for accessing the token context

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth(); // Get the setToken function from the context
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!username || !password) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    try {
      // Make API request
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const accessToken = data.data.access_token;
        console.log("Access Token:", accessToken);
        setToken(accessToken);
        navigate("/main");
      } else {
        // Show error message from backend
        toast.error(data.message || "Invalid username or password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="flex justify-start">
          <ConvoHub currentPage="login"/>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-2">Login</h1>

        <form className="mt-0 w-full space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-300 font-bold"
            >
              Username
            </label>
            <input
              type="username"
              id="username"
              className="w-full mt-2 px-4 py-2 bg-white border border-gray-500 rounded-full focus:border-indigo-500 focus:outline-none text-black placeholder-gray-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-base font-medium text-gray-300 font-bold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 px-4 py-2 bg-white border border-gray-500 rounded-full focus:border-indigo-500 focus:outline-none text-black placeholder-gray-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-lg font-bold text-black bg-blue-400 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;