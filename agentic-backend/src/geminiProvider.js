// GeminiProvider using Gemini REST API
class GeminiProvider {
  constructor(apiKey, modelName) {
    // Allow custom API key and model name, fallback to env vars
    this.apiKey = apiKey;
    this.modelName = modelName;

    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables or constructor");
    }

    if(!this.modelName) {
      throw new Error("GEMINI_MODEL is not set in environment variables or constructor");
    }

    // Build API URL
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
  }

  async generate(message) {
    // Prepare request payload
    const payload = {
      contents: [{ parts: [{ text: message }] }],
    };
    // Make POST request to Gemini API
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    // Return generated text if available
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  }
}

export default GeminiProvider;
