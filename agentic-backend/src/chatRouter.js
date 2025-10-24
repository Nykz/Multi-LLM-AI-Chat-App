import express from "express";
import GeminiProvider from "./geminiProviderNew.js";

const router = express.Router();

// Sample route for chat
router.post("/chat", async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  console.log("Received message:", message);

  try {
    const gemini = new GeminiProvider(
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_MODEL
    );

    const reply = await gemini.generate(message);

    res.json({ reply });
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    res.status(500).json({ error: "Failed to get a response from the AI." });
  }
});

export default router;
