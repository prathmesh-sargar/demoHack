import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setSingleInterview } from "../../redux/interviewSlice";
import { motion } from "framer-motion";
import Webcam from "react-webcam";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AiInterview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [webcamOn, setWebcamOn] = useState(false); // State to control webcam

  const singleInterview = useSelector((state) => state.interview.singleInterview);
 

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/AiInterview/get/${interviewId}`, {
          withCredentials: true,
        });
        dispatch(setSingleInterview(response.data));
        
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchInterviewData();
  }, [dispatch, interviewId]);

  return (
    <motion.div 
      className="max-w-5xl mx-auto mt-10 p-6 bg-gray-900 text-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center text-blue-500">
        🎤 AI Interview Details
      </h1>

      {/* 🔹 Main Layout - Job Details on Left, Webcam on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* 🔹 Job Details Section (Left Side) */}
        <motion.div 
          className="p-6 bg-gray-800 rounded-lg space-y-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold border-b pb-2">📌 Job Information</h2>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">💼 Job Role:</h3>
            <p className="text-gray-300">{singleInterview?.jobRole || "Loading..."}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">📄 Job Description:</h3>
            <p className="text-gray-300">{singleInterview?.jobDescription || "Loading..."}</p>
          </div>

          <div className="flex justify-between bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">🎯 Experience Level:</h3>
            <span className="text-gray-300">{singleInterview?.experienceLevel || "Loading..."} Years</span>
          </div>

          <div className="flex justify-between bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">📅 Created At:</h3>
            <span className="text-gray-300">
              {singleInterview?.createdAt ? new Date(singleInterview.createdAt).toLocaleDateString() : "Loading..."}
            </span>
          </div>

          <div className="flex justify-between bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">⭐ Final Score:</h3>
            <span className="text-gray-300">{singleInterview?.finalScore || "Not Available Yet"}</span>
          </div>

          <div className="flex justify-between bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">❓ Total Questions:</h3>
            <span className="text-gray-300">{singleInterview?.questions?.length || "Loading..."}</span>
          </div>

          {/* 🔹 Start AI Interview Button */}
          <motion.button
            onClick={() => navigate(`/AI-Interivew/${interviewId}/start`)}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-lg font-bold rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎤 Start AI Interview
          </motion.button>
        </motion.div>

        {/* 🔹 Webcam Section (Right Side) */}
        <motion.div 
          className="p-6 bg-gray-800 rounded-lg text-center space-y-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold border-b pb-2">📷 Webcam</h2>

          <div className="flex flex-col items-center">
            {webcamOn ? (
              <Webcam className="w-full h-[300px] bg-black rounded-lg" videoConstraints={{ facingMode: "user" }} />
            ) : (
              <div className="w-full h-[300px] bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Webcam Off</p>
              </div>
            )}

            {/* 🔹 Webcam Control Buttons */}
            <div className="mt-4 flex space-x-4">
              <motion.button
                onClick={() => setWebcamOn(true)}
                className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ▶️ Start Webcam
              </motion.button>

              <motion.button
                onClick={() => setWebcamOn(false)}
                className="px-5 py-2 bg-red-600 text-white rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⏹ Stop Webcam
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AiInterview;
