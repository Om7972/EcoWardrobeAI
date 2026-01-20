import dotenv from "dotenv";
import { multiAI } from "./server/services/multiAI.ts";

// Load environment variables
dotenv.config();

async function testMultiAI() {
  console.log("🧪 Testing Multi-AI Service directly...\n");
  
  const testMessages = [
    {
      role: "system",
      content: "You are a helpful AI assistant specializing in sustainable fashion."
    },
    {
      role: "user", 
      content: "Give me a quick tip about sustainable fashion."
    }
  ];
  
  console.log("🔄 Testing default configuration (Gemini primary, Groq fallback)...");
  try {
    const response = await multiAI.chat(testMessages);
    console.log("✅ Multi-AI Service working!");
    console.log("Response:", response);
  } catch (error) {
    console.error("❌ Multi-AI Service failed:", error.message);
  }
  
  console.log("\n🔄 Testing specific provider: Gemini...");
  try {
    const geminiResponse = await multiAI.chat(testMessages, { provider: "gemini" });
    console.log("✅ Gemini working!");
    console.log("Response:", geminiResponse);
  } catch (error) {
    console.error("❌ Gemini failed:", error.message);
  }
  
  console.log("\n🔄 Testing specific provider: Groq...");
  try {
    const groqResponse = await multiAI.chat(testMessages, { provider: "groq" });
    console.log("✅ Groq working!");
    console.log("Response:", groqResponse);
  } catch (error) {
    console.error("❌ Groq failed:", error.message);
  }
  
  console.log("\n🔄 Testing outfit suggestion...");
  try {
    const outfitSuggestion = await multiAI.generateOutfitSuggestion(
      "casual meeting",
      "sunny, 22°C",
      "business casual",
      ["white shirt", "dark jeans", "blazer", "sneakers"]
    );
    console.log("✅ Outfit suggestion working!");
    console.log("Response:", outfitSuggestion);
  } catch (error) {
    console.error("❌ Outfit suggestion failed:", error.message);
  }
  
  console.log("\n🏁 All tests completed!");
}

testMultiAI();