import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext"; // Assuming `useAuth` is in a context file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfessorReviews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professorList, setProfessorList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const { token } = useAuth(); // Get the token from context
  const navigate = useNavigate();

  // Fetch professor list
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        console.log("Fetching professor data...");
        const response = await fetch("http://127.0.0.1:8000/review/teachers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch professor data");
        }

        const { data } = await response.json();
        console.log("Fetched professor data:", data);
        setProfessorList(data);
      } catch (error) {
        console.error("Error fetching professor list:", error);
      }
    };

    if (token) {
      console.log("Token found, initiating professor fetch...");
      fetchProfessors();
    } else {
      console.warn("Token is missing, cannot fetch professor data.");
    }
  }, [token]);

  const openModal = () => {
    console.log("Modal opened.");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Modal closed.");
    setIsModalOpen(false);
    setSelectedProfessorId("");
    setSelectedCourseId("");
    setFilteredCourses([]);
  };

  const handleProfessorChange = (e) => {
    const professorId = e.target.value;
    console.log("Selected professor ID:", professorId);
    setSelectedProfessorId(professorId);

    if (professorId) {
      const selectedProfessor = professorList.find((prof) => prof.id === Number(professorId));
      if (selectedProfessor && selectedProfessor.courses) {
        console.log("Filtered courses for the selected professor:", selectedProfessor.courses);
        setFilteredCourses(selectedProfessor.courses);
      } else {
        setFilteredCourses([]);
      }
    } else {
      setFilteredCourses([]);
    }
  };

  const handleCourseChange = (e) => {
    console.log("Selected course ID:", e.target.value);
    setSelectedCourseId(e.target.value);
  };

  const handleSearch = () => {
    console.log("Search initiated...");
    console.log("Selected Professor ID:", selectedProfessorId);
    console.log("Selected Course ID:", selectedCourseId);

    if (!selectedProfessorId && !selectedCourseId) {
      console.warn("No professor or course selected.");
      toast.error("Please select a professor and a course.");
      return;
    }
    if (!selectedProfessorId) {
      console.warn("No professor selected.");
      toast.error("Please select a professor.");
      return;
    }
    if (!selectedCourseId) {
      console.warn("No course selected.");
      toast.error("Please select a course.");
      return;
    }

    console.log("Navigating to:", `/professor-review/${selectedProfessorId}/${selectedCourseId}`);
    navigate(`/professor-review/${encodeURIComponent(selectedProfessorId)}/${encodeURIComponent(selectedCourseId)}`);
    closeModal();
  };

  return (
    <div>
      <Button label="Professor Reviews" onClick={openModal} />
      <ToastContainer />

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[#1E1E1E] bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative rounded-2xl p-6 w-1/3 bg-[#1E1E1E]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white font-bold text-2xl w-8 h-8 flex justify-center items-center bg-gray-500 rounded-full"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white text-center mb-4">
              Professor Reviews
            </h2>

            <div className="mb-4">
              <label className="text-white text-left block mb-2">Professor Name</label>
              <select
                id="professor-name"
                className="bg-[#3B3B3B] w-full p-3 pr-10 pl-4 rounded-full text-white"
                value={selectedProfessorId}
                onChange={handleProfessorChange}
              >
                <option value="">Select a Professor</option>
                {professorList.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-white text-left block mb-2">Course Name</label>
              <select
                id="course"
                className="bg-[#3B3B3B] w-full p-3 pr-10 pl-4 rounded-full text-white"
                value={selectedCourseId}
                onChange={handleCourseChange}
                disabled={!filteredCourses.length}
              >
                <option value="">Select a Course</option>
                {filteredCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-2">
              <button
                className="text-white text-right py-2 px-6 rounded-lg bg-green-500 hover:bg-green-600 transition duration-300"
                onClick={handleSearch}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorReviews;
