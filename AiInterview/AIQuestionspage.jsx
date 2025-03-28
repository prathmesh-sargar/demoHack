import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { setSingleInterview } from "../../redux/interviewSlice";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { RiSpeakAiFill } from "react-icons/ri";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AIQuestionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const interview = useSelector((state) => state.interview.singleInterview);
  const questions = interview?.questions || [];
  const currentQuestion = questions[currentIndex];

  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/AiInterview/get/${interviewId}`, {
          withCredentials: true,
        });
        dispatch(setSingleInterview(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching interview:", error);
      }
    };
    fetchInterview();
  }, [dispatch, interviewId]);

  useEffect(() => {
    if (currentQuestion?.userAnswer) {
      setUserAnswer(currentQuestion.userAnswer);
    } else {
      setUserAnswer("");
    }
  }, [currentIndex, currentQuestion]);

    // ✅ Function to Convert Text to Speech
    const speakText = (text) => {
      if (!text) return;
      const synth = window.speechSynthesis; // Access browser's text-to-speech engine
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1; // Set speech speed (1 is normal, 0.8 is slower)
      utterance.pitch = 1; // Set pitch (1 is normal)
      synth.cancel(); // Stop previous speech if still playing
      synth.speak(utterance); // Speak the new question
    };
  
    // ✅ Speak the Question when the question changes
    useEffect(() => {
      if (currentQuestion?.questionText) {
        setTimeout(()=>{
          speakText(currentQuestion.questionText);
        },1000)
      }
    }, [currentIndex, currentQuestion]);
  


  const handleSaveAnswer = async () => {
    if (!userAnswer.trim())
      {  
        speakText("Please first give answer then submit this answer ok ");
          return alert("Please provide an answer!");
      }


    setSaving(true);
    try {  
      const response = await axios.post(
        
        `${API_BASE_URL}/api/v1/AiInterview/${interviewId}/submitAns`,
        {
          questionId: currentQuestion._id,
          userAnswer,
        },
        { withCredentials: true }
      );
     
      alert(response.data.message);
    } catch (error) {
      console.error("Error saving answer:", error.response.data.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStartRecording = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };
  
  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
  
    if (!transcript.trim()) {
      alert("Please speak your answer!");
      return;
    }
  
    setUserAnswer(transcript);
  
    // Save the answer after ensuring it's not empty
    setTimeout(() => {
      try {
        handleSaveAnswer();
      } catch (error) {
        console.error("Error saving answer:", error);
        alert("Failed to save your answer. Please try again!");
      }
    }, 100); // Small delay to ensure state updates
  
    resetTranscript();
  };

  function speakSomething(text){
    speakText(text);
  };

  function ScorePage(){
    speakText("Now you can seen your Score how much you score and your performance")
    navigate(`/AI-Interivew/${interviewId}/score`)
  }
  return (
    <motion.div 
      className="max-w-5xl mx-auto mt-10 p-6 bg-gray-900 text-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p className="text-center text-xl">Loading Questions...</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center text-blue-500">
            🎤 AI Interview Questions
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Left Side - Question & Input */}
            <motion.div 
              className="p-6 bg-gray-800 rounded-lg space-y-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold border-b pb-2">❓ Question {currentIndex + 1} / {questions.length}</h2>
              <p className="text-gray-300">{currentQuestion?.questionText || "No question available"}</p>

              <RiSpeakAiFill
              className="text-2xl cursor-pointer"
               onClick={()=>{speakSomething(currentQuestion?.questionText)}}
              />
              <textarea
                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                rows="4"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
              ></textarea>

              <button
                onClick={handleSaveAnswer}
                className={`w-full py-3 text-lg font-bold rounded-lg shadow-md ${
                  saving ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
                }`}
                disabled={saving}
              >
                {saving ? "Saving..." : "💾 Save Answer"}
              </button>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                  className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                  disabled={currentIndex === 0}
                >
                  ⬅ Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                  >
                    Next ➡
                  </button>
                ) : (
                  <button
                    onClick={() => {ScorePage()}}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
                  >
                    ✅ Submit Interview
                  </button>
                )}
              </div>
            </motion.div>

            {/* Right Side - Webcam & Recording */}
            <motion.div 
              className="p-6 bg-gray-800 rounded-lg text-center space-y-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold border-b pb-2">📷 Webcam</h2>

              {webcamOn ? <Webcam className="w-full h-[300px] bg-black rounded-lg" videoConstraints={{ facingMode: "user" }} /> : 
                <div className="w-full h-[300px] bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Webcam Off</p>
                </div>
              }

              <div className="flex space-x-4">
                <button
                  onClick={() => setWebcamOn(true)}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg"
                >
                  ▶️ Start Webcam
                </button>
                <button
                  onClick={() => setWebcamOn(false)}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg"
                >
                  ⏹ Stop Webcam
                </button>
              </div>

              <button
                onClick={listening ? handleStopRecording : handleStartRecording}
                className="w-full py-3 text-lg font-bold rounded-lg shadow-md bg-blue-600 hover:bg-blue-500"
              >
                🎙 {listening ? "Stop Recording" : "Start Recording"}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AIQuestionsPage;
