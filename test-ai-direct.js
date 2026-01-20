import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

async function testGeminiDirect() {
  console.log("🧪 Testing Gemini API directly...\n");
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1";
  
  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found in environment");
    return;
  }
  
  console.log("✅ Gemini API Key found");
  
  // Test gemini-pro model
  try {
    console.log("🔄 Testing gemini-pro model...");
    
    const response = await axios.post(
      `${GEMINI_BASE_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: "Hello! Give me a brief tip about sustainable fashion." }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log("✅ Gemini Pro working!");
      console.log("Response:", response.data.candidates[0].content.parts[0].text);
    } else {
      console.log("⚠️ Unexpected response format:", response.data);
    }
    
  } catch (error) {
    console.error("❌ Gemini Pro failed:", error.response?.data || error.message);
  }
}

async function testGroqDirect() {
  console.log("\n🧪 Testing Groq API directly...\n");
  
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY not found in environment");
    return;
  }
  
  console.log("✅ Groq API Key found");
  
  try {
    console.log("🔄 Testing Groq llama3-8b-8192 model...");
    
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: "Hello! Give me a brief tip about sustainable fashion."
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (response.data?.choices?.[0]?.message?.content) {
      console.log("✅ Groq working!");
      console.log("Response:", response.data.choices[0].message.content);
    } else {
      console.log("⚠️ Unexpected response format:", response.data);
    }
    
  } catch (error) {
    console.error("❌ Groq failed:", error.response?.data || error.message);
  }
}

async function testOpenAIDirect() {
  console.log("\n🧪 Testing OpenAI API directly...\n");
  
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not found in environment");
    return;
  }
  
  console.log("✅ OpenAI API Key found");
  
  try {
    console.log("🔄 Testing OpenAI gpt-3.5-turbo model...");
    
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Hello! Give me a brief tip about sustainable fashion."
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (response.data?.choices?.[0]?.message?.content) {
      console.log("✅ OpenAI working!");
      console.log("Response:", response.data.choices[0].message.content);
    } else {
      console.log("⚠️ Unexpected response format:", response.data);
    }
    
  } catch (error) {
    console.error("❌ OpenAI failed:", error.response?.data || error.message);
  }
}

async function runAllTests() {
  await testGeminiDirect();
  await testGroqDirect();
  await testOpenAIDirect();
  
  console.log("\n🏁 All tests completed!");
}

runAllTests();