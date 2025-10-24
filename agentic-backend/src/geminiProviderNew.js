import { GoogleGenAI } from "@google/genai";

class GeminiProvider {
  constructor(apiKey, modelName) {
    this.apiKey = apiKey;
    this.modelName = modelName;

    if (!this.apiKey) {
      throw new Error("API key is required");
    }

    if (!this.modelName) {
      throw new Error("Model name is required");
    }
  }

  async generate(prompt) {
    try {
      const genAI = new GoogleGenAI(this.apiKey);
      const response = await genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
        // config: {
        //   thinkingConfig: {
        //     thinkingBudget: 0, // Disables thinking
        //   },
        // },
      });
      const reply = response.text;
      return reply || "No response";
    } catch (error) {
      console.error("Error in GeminiProvider.generate:", error);
      // Re-throw the error to be caught by the router's error handler
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}

export default GeminiProvider;
