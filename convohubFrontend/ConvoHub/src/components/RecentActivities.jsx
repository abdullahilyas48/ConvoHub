import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const RecentActivities = ({ token, limit = 10 }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/rooms/recent/?limit=${limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching recent activities:", errorData);
          throw new Error("Failed to fetch recent activities");
        }

        const data = await response.json();

        // Debug: Log the room_id for each activity in the response
        if (data.data.length > 0) {
          data.data.forEach((activity) => {
            console.log("Room ID:", activity.room?.room_id);
          });

          setActivities(data.data);
        } else {
          console.log("No recent activities found in response.");
          //toast.info("No recent activities found.");
        }
      } catch (error) {
        console.error(error);
        //toast.error("Error loading recent activities.");
      }
    };

    fetchRecentActivities();
  }, [token, limit]);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-white text-center mb-4">Recent Activities</h2>

      {activities.length > 0 ? (
        activities.map((activity, index) => {
          const topic = activity.room?.room_name || "Untitled Room";
          const user = activity.user?.username || "Anonymous";
          const time = new Date(activity.created_at).toLocaleString() || "Unknown time";

          return (
            <div
              key={activity.message_id}
              className={`flex items-start space-x-3 py-3 ${
                index > 0 ? "border-t border-gray-600" : ""
              }`}
            >
              <span
                className={`h-3 w-3 mt-1 rounded-full ${
                  index < 2 ? "bg-red-500" : "bg-green-500"
                }`}
              ></span>
              <div>
                <Link
                  to={`/rooms/${activity.room?.room_id}/`}
                  className="text-lg font-bold text-white hover:underline"
                >
                  {topic}
                </Link>
                <p className="text-sm text-gray-400">
                  <span className="text-blue-500">{user}</span> posted a new comment - {time}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-400">No recent activities found.</p>
      )}
    </div>
  );
};

export default RecentActivities;
