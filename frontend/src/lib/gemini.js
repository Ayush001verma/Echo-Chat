import { axiosInstance } from "./axios";

// Using the same axios instance as the rest of the app might be better, 
// but for simplicity we'll just use a relative URL which assumes 
// the dev proxy or production URL is correctly configured.
const API_URL = "/ai/generate";

export const callGeminiChat = async (messagesHistory) => {
  // Convert our local message format to Gemini's expected format
  const contents = messagesHistory.map((msg) => ({
    role: msg.senderId === "echo-ai" ? "model" : "user",
    parts: [{ text: msg.text || "" }],
  }));

  try {
    const res = await axiosInstance.post(API_URL, {
      contents,
      systemInstruction: {
        parts: [{ text: "You are Echo AI, a helpful, friendly, and concise AI assistant integrated directly into the user's messaging app. Respond conversationally." }]
      },
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    });

    const data = res.data;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    const message = error.response?.data?.message || error.message;
    throw new Error(`AI assistant error: ${message}`);
  }
};
