import { useState } from "react";
import axios from "axios";
import { pdfToImage } from "../../utiles/pdfToImage.js";
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

function ATSResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [internships, setInternships] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(""); // Clear error when selecting a new file
  };

  const fetchInternships = async (jobCategory) => {
    // if (!category) return;
    // setLoading(true);

    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/Internship/get?category=${jobCategory}`
      );
  
      // Filter out internships that do not have a title
      const filteredInternships = data.filter((internship) => internship.title);
  
      setInternships(filteredInternships);
    } catch (error) {
      console.error("Error fetching internships:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !jobDescription) {
      setError("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const pdfImage = await pdfToImage(file);
      const API_KEY = "AIzaSyAs11NMd7OXY7apjUh_NWUwZKcMgd6b_yM"; // Replace with actual API Key
      const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: `Job Description: ${jobDescription}` },
              { inline_data: { mime_type: "image/jpeg", data: pdfImage.split(",")[1] } },
              // {
              //   text: `You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality. Your task is to evaluate the resume against the provided job description. 
              //   Provide a match percentage, list missing keywords, and give final thoughts. Also, as an experienced Technical HR Manager, analyze whether the candidate's profile aligns with the role, highlighting strengths and weaknesses.`
              // }
              {
                text: `You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality. Your task is to evaluate the resume against the provided job description.  
              
                1. Provide a match percentage.  
                2. List missing keywords.  
                3. Give final thoughts on the candidate's alignment with the role, highlighting strengths and weaknesses.  
                4. Identify the most relevant job category for the candidate based on the resume and job description.  
              
                **Response Format:**  
                Match Percentage: [XX%]  
                Missing Keywords: [keyword1, keyword2, keyword3]  
                Final Thoughts: [Your detailed analysis here]  
                Job Category: [Category Name]  
                `
              }
              
            ]
          }
        ]
      };
  
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" }
      });

      // console.log("Resume Extract : ",res);
      
      const responseText = res.data.candidates[0]?.content?.parts[0]?.text || "";
      const categoryMatch = responseText.match(/Job Category:\s*\[(.*?)\]/);  
      const jobCategory = categoryMatch ? categoryMatch[1] : "Full Stack Development";  // Default if no category found
      console.log("Extracted Job Category:", jobCategory);

      console.log("text parse",res.data.candidates[0]?.content?.parts[0]?.text || "No response received.");
      setResponse(res.data.candidates[0]?.content?.parts[0]?.text || "No response received.");
      fetchInternships(jobCategory);
    } catch (error) {
      console.error("Error:", error);
      setError("Error processing the request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(response);
  

 
  return (
   <>
   <div>
   </div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-center mb-4 text-purple-700"> Resume Analyzer </h2>
        <p className="font-semibold">Job Description</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter Job Description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-lg"
          />

          {error && (
            <p className="text-red-600 text-sm flex items-center">
              <FaExclamationTriangle className="mr-2" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-purple-700 transition duration-300"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Analyzing...
              </>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg" > 
            <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
              <FaCheckCircle className="mr-2 text-green-600" /> Resume Analysis Report
            </h3>

            {response.split("*").map((part, index) => (
              <p key={index} className="mb-2 font-semibold md:text-xl">{part.trim()}</p>
            ))}
          </div>
        )}
      </div>

      {loading && <p className="text-xl font-semibold">Loading...</p>}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl m-4">
  {internships.map((internship, index) => (

<motion.div
key={index}
className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl cursor-pointer"
whileHover={{ scale: 1.05 }}
onClick={() => window.open(internship.link, "_blank")}
>
<div className="flex gap-4">
<img src={internship.logo} alt={internship.company} className="h-16 w-16 mb-4" />
<h2 className="text-lg font-bold">{internship.title}</h2>
</div>
<p className="text-gray-700">{internship.company}</p>
<p className="text-gray-500">📍 {internship.location}</p>
<p className="text-green-600 font-semibold">💰 {internship.stipend}</p>
<p className="text-gray-500">⏳ {internship.duration}</p>
</motion.div>  


  ))}
</div>
    </div>
   </>
  );
}

export default ATSResume;
