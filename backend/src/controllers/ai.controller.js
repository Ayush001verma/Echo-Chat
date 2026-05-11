import { ENV } from "../lib/env.js";

export const generateAIResponse = async (req, res) => {
  try {
    const { contents, systemInstruction, generationConfig } = req.body;

    if (!contents) {
      return res.status(400).json({ message: "Contents are required" });
    }

    const GEMINI_API_KEY = ENV.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("[AI Controller] GEMINI_API_KEY is missing from environment variables.");
      return res.status(500).json({ message: "Gemini API key not configured on server" });
    }

    const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: generationConfig || { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      return res.status(response.status).json({ message: `Gemini API error: ${errBody.slice(0, 200)}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in generateAIResponse:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
