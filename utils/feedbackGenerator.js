import { GoogleGenerativeAI } from '@google/generative-ai'

// 🔹 Compare AI Answer & User Answer for Feedback
export const generateAIAnalysis = async (question, aiAnswer, userAnswer) => {

  const genAI = new GoogleGenerativeAI("AIzaSyCnraFmUmkRO-E6o5e71mBygNsq9cCm7nQ");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Compare the correct answer: "${aiAnswer}" with the user's answer: "${userAnswer}". 
  Provide structured feedback in 2-3 sentences and a score out of 10.
  Response format: { "feedback": "...", "score": "..." }`;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim(); // Get response text and remove extra spaces

    // If response is wrapped in markdown-style triple backticks, clean it
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/```json/, "").replace(/```/, "").trim();
    }
    // console.log(responseText);
    return JSON.parse(responseText); // Parse JSON and return it
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    return { feedback: "AI feedback failed.", score: 0 };
  }
};


