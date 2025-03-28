

import { GoogleGenerativeAI } from '@google/generative-ai'

// 🔹 Generate AI Interview Questions
export const generateQuestions = async (jobRole, jobDescription, experienceLevel) => {

  const genAI = new GoogleGenerativeAI("AIzaSyCnraFmUmkRO-E6o5e71mBygNsq9cCm7nQ");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // const prompt = `Generate a JSON response with multiple question-answer pairs related to the topic: "JobRole : " "${JobRole}".  "Jo Description : "${JobDescript}  and experience level : "${exp} Each question should be relevant to the topic, and the answers should be concise, explaining in one line only. Format the output strictly as a JSON object with a "questions" key containing an array of objects, where each object has a "question" and "answer" field. Do not include any markdown formatting or additional text.`;
  const prompt = `Act as a senior ${jobRole}. Generate 7-15 technical and behavioral interview questions based on ${jobDescription}  for an ${experienceLevel}-level of experience have that candidate. Format the output strictly as a JSON object with a "questions" key containing an array of objects, where each object has a "question" and "answer" field. Do not include any markdown formatting or additional text`

  const result = await model.generateContent(prompt);
  let responseText = result.response.text().trim(); // Get response text and remove extra spaces

  // If response is wrapped in markdown-style triple backticks, clean it
  if (responseText.startsWith("```json")) {
    responseText = responseText.replace(/```json/, "").replace(/```/, "").trim();
  }

  try {
    const jsonData = JSON.parse(responseText); // Parse JSON
    // console.log(jsonData.questions); // Log only the questions array
    return jsonData.questions;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }


};  
