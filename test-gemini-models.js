import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

async function listGeminiModels() {
  console.log("🔍 Listing available Gemini models...\n");
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1";
  
  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found in environment");
    return;
  }
  
  try {
    const response = await axios.get(
      `${GEMINI_BASE_URL}/models?key=${GEMINI_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("✅ Available Gemini models:");
    response.data.models.forEach(model => {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log(`- ${model.name} (${model.displayName})`);
      }
    });
    
    // Test with gemini-1.5-flash
    console.log("\n🔄 Testing gemini-1.5-flash...");
    try {
      const testResponse = await axios.post(
        `${GEMINI_BASE_URL}/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: "Hello! Give me a brief tip about sustainable fashion." }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (testResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log("✅ gemini-1.5-flash working!");
        console.log("Response:", testResponse.data.candidates[0].content.parts[0].text);
      }
    } catch (error) {
      console.error("❌ gemini-1.5-flash failed:", error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error("❌ Failed to list models:", error.response?.data || error.message);
  }
}

listGeminiModels();