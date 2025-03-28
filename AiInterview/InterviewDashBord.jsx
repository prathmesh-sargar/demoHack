import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setUserInterviews } from "../../redux/interviewSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function InterviewDashBord() {
  const dispatch = useDispatch();
  const userInterviewList = useSelector((state) => state.interview.userInterviews);


  useEffect(() => {
    const fetchAllInterview = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/AiInterview/getUserInterviews`, {
          withCredentials: true,
        });

        console.log("curr user : ",response);
        
       
        dispatch(setUserInterviews(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllInterview();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <motion.h1
        className="text-3xl font-bold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📋 Interview Dashboard
      </motion.h1>

      {/* Start Interview Button */}
      <div className="flex justify-center mb-8">
        <Link to="/AIJobForm">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Start New Interview
          </motion.button>
        </Link>
      </div>

      {/* Interview List Section */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">📝 Interview List</h2>

        {userInterviewList.length === 0 ? (
          <p className="text-center text-gray-500">No interviews found. Start your first interview now!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userInterviewList.map((interview) => (
              <motion.div
                key={interview._id}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-300 flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold text-gray-800">{interview?.jobRole}</h3>
                <p className="text-sm text-gray-600">📅 Date: {interview?.updatedAt.toString().split("T")[0]}</p>
                <div className="mt-4 flex gap-3">
                  <Link to={`/AI-Interivew/${interview?._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow">
                      Start
                    </button>
                  </Link>

                  <Link to={`/AI-Interivew/${interview?._id}/score`}>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow">
                    Feedback
                  </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
