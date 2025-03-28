import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setSingleInterview } from "../../redux/interviewSlice";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ScorePage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const InterviewData = useSelector((state) => state.interview.singleInterview);
  const [expandedQuestion, setExpandedQuestion] = useState(null); // To track which question is expanded

  useEffect(() => {
    const getAllInterviewData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/AiInterview/get/${interviewId}`, {
          withCredentials: true,
        });
        dispatch(setSingleInterview(response.data));
      } catch (error) {
        console.error("Error fetching interview:", error);
      }
    };
    getAllInterviewData();
  }, [dispatch, interviewId]);

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 p-6 bg-gray-900 text-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-center text-blue-500">📊 Interview Score</h1>
      <p className="text-lg text-center text-gray-300 mt-2">
        final performance score!
      </p>

      {/* Circular Progress Bar for Final Score */}
      <div className="flex justify-center my-6">
        <div className="w-32 h-32">
          <CircularProgressbar
            value={InterviewData?.finalScore || 0}
            maxValue={10}
            text={`${InterviewData?.finalScore || 0}/10`}
            styles={buildStyles({
              textColor: "#ffffff",
              pathColor: InterviewData?.finalScore > 6 ? "#10b981" : "#f59e0b",
              trailColor: "#374151",
              textSize: "16px",
            })}
          />
        </div>
      </div>

      {/* Questions & Answers Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">📝 Review Your Answers</h2>
        {InterviewData?.questions?.map((question, index) => (
          <motion.div
            key={question._id}
            className="bg-gray-800 rounded-lg mb-4 p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
            >
              <h3 className="text-lg font-medium text-white">❓ {question.questionText}</h3>
              <button className="text-gray-400 text-2xl">
                {expandedQuestion === index ? "🔼" : "🔽"}
              </button>
            </div>

            {expandedQuestion === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-3 p-3 bg-gray-700 rounded-lg"
              >
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-green-400">✅ Your Answer:</span>{" "}
                  {question.userAnswer || "No answer provided"}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-bold text-blue-400">🤖 AI Feedback:</span>{" "}
                  {question.aiFeedback || "No feedback available"}
                </p>
                <p className="text-sm font-bold text-yellow-400 mt-2">
                  🎯 Score: {question.score}/10
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Go to Dashboard Button */}
      <div className="flex justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={() => navigate("/InterviewDashBord")}
        >
          🔙 Go to Dashboard
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScorePage;
