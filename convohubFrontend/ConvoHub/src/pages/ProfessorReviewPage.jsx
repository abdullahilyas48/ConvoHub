import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import the useAuth hook
import ConvoHub from "../components/ConvoHub";
import UserProfile from "../components/UserProfile";
import avatarImage from "../assets/images/avatar.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfessorReviewPage = () => {
  const { professor, course } = useParams(); // These are IDs passed from URL
  const { token } = useAuth(); // Get the token from AuthContext

  // Convert `professor` and `course` from string to number
  const professorId = Number(professor);
  const courseId = Number(course);

  const [professorName, setProfessorName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [reviews, setReviews] = useState([]);
  const [teachingStyle, setTeachingStyle] = useState(0);
  const [marking, setMarking] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [username, setUsername] = useState(""); // Ideally from user authentication
  const [teachingStyleHover, setTeachingStyleHover] = useState(null);
  const [markingHover, setMarkingHover] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/review/teachers/${professorId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch professor data");
        const data = await response.json();
        setProfessorName(data.data.name);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching professor data");
      }
    };

    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/review/courses/${courseId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch course data");
        const data = await response.json();
        setCourseName(data.data.name);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching course data");
      }
    };

    const fetchTeacherReviews = async () => {
      try {
        const url = `http://127.0.0.1:8000/review/teacher-reviews/?teacher_id=${professorId}&course_id=${courseId}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Backend Error Response:", errorData);
          throw new Error("Failed to fetch teacher reviews");
        }
        const data = await response.json();
        console.log("REVIEW DATA:", data);
        setReviews(data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching teacher reviews");
      }
    };

    fetchProfessorData();
    fetchCourseData();
    fetchTeacherReviews();
  }, [professorId, courseId, token]);

  const handleSubmit = async () => {
    if (teachingStyle === 0) {
      toast.error("Please rate the Teaching Style!");
      return;
    }
    if (marking === 0) {
      toast.error("Please rate the Marking!");
      return;
    }

    const newReview = {
      teacher_id: professorId,
      course_id: courseId,
      teaching_style: teachingStyle,
      marking: marking,
      additional_remarks: remarks,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/review/teacher-reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error Response:", errorData);
        throw new Error("Failed to submit review");
      }

      const data = await response.json();
      const addedReview = data.data;
      setReviews((prevReviews) => [...prevReviews, addedReview]);
      setTeachingStyle(0);
      setMarking(0);
      setRemarks("");
      toast.success("Review Submitted Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error submitting your review.");
    }
  };

  const renderStars = (rating, maxRating, onClick, setHover, hoverState) => {
    return [...Array(maxRating)].map((_, index) => {
      const isHovered = hoverState !== null && index <= hoverState;
      const isSelected = index < rating;
      const starClass = isSelected || isHovered ? "text-pink-500" : "text-gray-400";

      return (
        <span
          key={index}
          className={`cursor-pointer text-3xl ${starClass} transition-colors duration-200`}
          onClick={() => onClick(index + 1)}
          onMouseEnter={() => setHover(index)}
          onMouseLeave={() => setHover(null)}
          aria-label={`Rate ${index + 1} star`}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="relative">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
      <div className="absolute top-4 left-[40%] transform -translate-x-1/2 z-10">
        <ConvoHub />
      </div>
      <div className="absolute top-4 right-16 z-10">
        <UserProfile username={username} avatar={avatarImage} email="user@example.com" />
      </div>
      <div className="flex justify-center mt-40 px-6">
        <div className="flex-1 bg-[#282853] backdrop-blur-sm bg-opacity-70 rounded-3xl p-6 border border-white mr-6 w-[700px] h-[600px]">
          <h2 className="text-white text-3xl font-bold text-left mb-2 ml-4">{professorName}</h2>
          <h3 className="text-white text-xl text-left ml-4 mb-6">{courseName}</h3>
          <div className="h-[300px] overflow-y-auto border-t border-gray-500 pt-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="text-white mb-4 flex items-start">
                <img src={avatarImage} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
                <div className="flex flex-col">
                <strong className="mb-1">
                {review.username ? review.username : `Anonymous ${review.id}`}:
                </strong>
                <div className="text-white break-words max-w-[500px]">
                Teaching Style: {review.teaching_style} ★
                <br />
                Marking: {review.marking} ★
                <br />
                Remarks: {review.additional_remarks}
                </div>
                </div>
              </div>

              ))
            ) : (
              <p className="text-white text-left ml-4">No reviews yet. Be the first to leave a review!</p>
            )}
          </div>
        </div>
        <div className="w-[400px] bg-[#282853] backdrop-blur-sm bg-opacity-70 rounded-3xl p-6 h-[600px]">
          <h2 className="text-white text-xl font-bold text-center mb-4">Submit Professor Review</h2>
          <div className="mb-4">
            <label className="text-white block mb-2">Professor Name</label>
            <input
              type="text"
              value={professorName}
              disabled
              className="w-full bg-gray-600 border border-black text-white p-3 rounded-full"
            />
          </div>
          <div className="mb-4">
            <label className="text-white block mb-2">Course Name</label>
            <input
              type="text"
              value={courseName}
              disabled
              className="w-full bg-gray-600 border border-black text-white p-3 rounded-full"
            />
          </div>
          <div className="mb-4">
            <label className="text-white block mb-2">Teaching Style</label>
            <div className="flex">{renderStars(teachingStyle, 5, setTeachingStyle, setTeachingStyleHover, teachingStyleHover)}</div>
          </div>
          <div className="mb-4">
            <label className="text-white block mb-2">Marking</label>
            <div className="flex">{renderStars(marking, 5, setMarking, setMarkingHover, markingHover)}</div>
          </div>
          <div className="mb-4">
            <label className="text-white block mb-2">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-gray-600 border border-black text-white p-3 rounded-lg"
              placeholder="Enter your remarks here"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorReviewPage;
