import React, { useState } from "react";
import { Link } from "react-router-dom";
import ConvoHub from "../components/ConvoHub";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SignUp from "../assets/animations/signup-animation.json";
import Lottie from 'lottie-react'
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext"; // Import the custom hook for accessing the token context

const SignupPage = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setToken } = useAuth(); // Get the setToken function from the context
  const navigate = useNavigate();

  // Function to validate email
  const validateEmail = (email) => {
    const regex = /^l\d{6}@lhr\.nu\.edu\.pk$/ 
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if any field is missing
    if (!username || !email || !password) {
      toast.error("Please enter all fields", {
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
  
    // Validate email
    if (!validateEmail(email)) {
      toast.error(
        "Please enter a valid NU email address (e.g., l221234@lhr.nu.edu.pk)",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }
  
    // Validate password length
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long", {
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
  
    // If all validations pass
    const newUser = {
      username,
      email,
      password,
    };
  
    try {
      // Send API request
      const response = await fetch("http://127.0.0.1:8000/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const responseData = await response.json(); // Parse the JSON response
      console.log("Full Response Data:", responseData); //debug purpose
      if (response.ok) {
        const token = responseData.data.access_token;
        // Log the token to verify
        console.log("Generated Token:", token);
        setToken(token); // Store the token in context

  
        toast.success("Account created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login"); // Redirect to a welcome or login page
      } else {
        console.log("Error Data Object:", responseData);
        if (responseData.meta && responseData.meta.message) {
          // Display specific error messages
          if (responseData.meta.message.includes("Email already exists!")) {
            toast.error("Email already in use", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else if (responseData.meta.message.includes("Username already exists!")) {
            toast.error("Username already in use", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            toast.error(responseData.message || "Signup failed", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="absolute top-[80px] left-[220px] h-[400px]">
        <ConvoHub currentPage="signup"/>
      </div>
      <div
  style={{
    position: 'fixed', // Always relative to the viewport
    top: '180px', // 50px from the top of the screen
    left: '180px', // 100px from the left of the screen
    height: '300px',
    width: '480px',
  }}
>
  <Lottie loop={true} animationData={SignUp} />
</div>


      <h1 className="text-right block text-[40px] absolute top-[190px] left-[770px] font-dark text-gray-300 font-josefin">
        Create Account
      </h1>
      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 ml-[430px] mt-[200px]"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-base font-medium text-gray-300 font-bold"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full mt-2 px-4 py-2 bg-white border border-gray-500 rounded-full focus:border-indigo-500 focus:outline-none text-black placeholder-gray-500"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-base font-medium text-gray-300 font-bold"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full mt-2 px-4 py-2 bg-white border border-gray-500 rounded-full focus:border-indigo-500 focus:outline-none text-black placeholder-gray-500"
            placeholder="eg. l229876@lhr.nu.edu.pk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Create Account
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-5 ml-[550px] text-center text-sm text-gray-300">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;