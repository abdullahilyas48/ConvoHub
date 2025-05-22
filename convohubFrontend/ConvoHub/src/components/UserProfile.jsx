import React, { useState, useEffect } from "react";
import avatarImage from "../assets/images/avatarImage.png"; // Default avatar image
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext to access the token
import LogoutButton from "../components/LogoutButton";

const UserProfile = () => {
  const avatarImage1 = "/assets/images/avatar.png"; // Accessible from the browser
  const avatarImage2 = "/assets/images/avatarM.png"; // Accessible from the browser

  const { token } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup toggle state
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false); // Image selection popup state
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    bio: "",
    profile_image: null, // Start as null to allow fallback logic
  }); // Profile data state
  const [newBio, setNewBio] = useState(""); // State for editable bio
  const [newProfileImage, setNewProfileImage] = useState(null); // State for new profile image
  const [isUpdating, setIsUpdating] = useState(false); // Updating state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const togglePopup = () => {
    if (isPopupOpen) {
      // Reset fields when closing popup (optional for bio)
      setNewBio(profileData.bio);
      // Don't reset newProfileImage here, so it persists after closing the popup
    }
    setIsPopupOpen(!isPopupOpen);
  };

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile data...");
  
      const response = await fetch("http://127.0.0.1:8000/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        console.error("Failed to fetch profile. Status:", response.status);
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Parsed response data:", data);
  
      // Make sure profile_image is being correctly set
      setProfileData({
        username: data.data.username || "",
        email: data.data.email || "No email available",
        bio: data.data.bio || "This is your bio...",
        profile_image: data.data.profile_image || null,  // Set profile image correctly
      });
  
      // If the profile image is returned in the response, update newProfileImage state
      if (data.data.profile_image) {
        setNewProfileImage(data.data.profile_image);
      } else {
        setNewProfileImage(null); // Reset if no image is returned
      }
  
      setNewBio(data.data.bio || ""); // Pre-fill the editable bio field
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleImageSelection = (imagePath) => {
    console.log("Selected image path:", imagePath);
  
    // Fetch the image and convert it into a Blob
    fetch(imagePath)
      .then(response => response.blob())
      .then(blob => {
        // Create a file from the blob and set it as the new profile image
        const file = new File([blob], "profile_image.png", { type: blob.type });
        setNewProfileImage(file); // Store the file in the state
      })
      .catch(error => {
        console.error("Error converting image to blob:", error);
      });
  
    setIsImagePopupOpen(false); // Close the image selection popup
  };
  

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("bio", newBio);
  
    // If a new profile image has been selected, append it to the FormData
    if (newProfileImage) {
      formData.append("profile_image", newProfileImage); // Now it's a binary file
    }
  
    try {
      setIsUpdating(true);
  
      const response = await fetch("http://127.0.0.1:8000/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Response from backend after update:", data);
  
      setProfileData((prevData) => ({
        ...prevData,
        bio: data.data.bio,
        profile_image: data.data.profile_image || prevData.profile_image,
      }));
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  

  const getProfileImage = () => {
    // If `profile_image` is null, fallback to the default avatar
    if (!profileData.profile_image && !newProfileImage) {
      return avatarImage; // Default avatar image
    }
  
    // If `newProfileImage` is a File object, create a preview URL
    if (newProfileImage instanceof File) {
      return URL.createObjectURL(newProfileImage);
    }
  
    // For relative URLs from the backend, prepend the base URL
    const baseURL = "http://127.0.0.1:8000";
    return `${baseURL}${profileData.profile_image}`;
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <div
        className="flex items-center justify-center cursor-pointer absolute right-5 top-4"
        onClick={togglePopup}
      >
        <img
          src={getProfileImage()} // Fallback logic applied
          alt={`${profileData.username} avatar`}
          className="w-16 h-16 rounded-full border-1 border-white mr-4 object-cover"
        />
        <span className="text-lg font-bold text-white">{profileData.username}</span>
      </div>

      {isPopupOpen && (
        <div className="absolute top-40 right-20 bg-[#1E1E1E] border-2 border-white rounded-xl p-6 w-[460px] z-50 flex flex-col justify-between h-auto">
          <div className="flex items-center mb-4">
            <img
              src={getProfileImage()}
              alt={`${profileData.profile_image} avatar`}
              className="w-12 h-12 rounded-full border-1 border-white mr-4 object-cover cursor-pointer"
              onClick={() => setIsImagePopupOpen(true)} // Open image selection popup
            />
            <h3 className="text-2xl font-bold text-white">{profileData.username}</h3>
            <button
              className="bg-gray-500 font-bold text-white rounded-full w-8 h-8 flex justify-center items-center ml-auto"
              onClick={togglePopup}
            >
              x
            </button>
          </div>
          <div className="mt-2">
            <div className="flex items-center mb-4">
              <p className="text-white font-semibold text-lg w-1/4">Email:</p>
              <input
                type="text"
                value={profileData.email}
                className="w-3/4 bg-transparent p-2 text-white"
                disabled
              />
            </div>
            <div className="flex items-center mb-4">
              <p className="text-white font-semibold text-lg w-1/4">Bio:</p>
              <textarea
                className="w-1/2 bg-[#D9D9D91A] border-2 border-black rounded-md p-2 text-white"
                rows="2"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="bg-[#4CAF50] text-white rounded-md px-6 py-2 hover:bg-[#388E3C]"
              onClick={togglePopup}
            >
              Close
            </button>
            <button
              className="bg-[#4CAF50] text-white rounded-md px-6 py-2 hover:bg-[#388E3C] ml-6 mr-5"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Save"}
            </button>
            <LogoutButton /> {/* Add this component */}
          </div>
        </div>
      )}

      {/* Image Selection Popup */}
      {isImagePopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-[#1E1E1E] border-2 border-white rounded-xl p-8 w-[350px] h-[300px] flex flex-col items-center">
            <h3 className="text-white font-bold text-xl mb-6">Select Profile Image</h3>
            <div className="flex space-x-6">
              <img
                src={avatarImage1}
                alt="Avatar 1"
                className="w-30 h-20 rounded-full cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleImageSelection(avatarImage1)}
              />
              <img
                src={avatarImage2}
                alt="Avatar 2"
                className="w-20 h-20 rounded-full cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleImageSelection(avatarImage2)}
              />
            </div>
            <button
              className="bg-gray-500 text-white rounded-md px-6 py-3 mt-16 hover:bg-gray-600 transition-colors"
              onClick={() => setIsImagePopupOpen(false)} // Close popup without selection
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 