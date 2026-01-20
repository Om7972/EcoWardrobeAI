import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

async function testGemini25Flash() {
  console.log("🧪 Testing Gemini 2.5 Flash...\n");
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1";
  
  try {
    const response = await axios.post(
      `${GEMINI_BASE_URL}/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log("✅ Gemini 2.5 Flash working!");
      console.log("Response:", response.data.candidates[0].content.parts[0].text);
      return true;
    }
  } catch (error) {
    console.error("❌ Gemini 2.5 Flash failed:", error.response?.data || error.message);
    return false;
  }
}

async function testGroqModels() {
  console.log("\n🧪 Testing Groq models...\n");
  
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const models = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant", 
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
  ];
  
  for (const model of models) {
    try {
      console.log(`🔄 Testing Groq ${model}...`);
      
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: model,
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
        console.log(`✅ Groq ${model} working!`);
        console.log("Response:", response.data.choices[0].message.content);
        return model;
      }
    } catch (error) {
      console.error(`❌ Groq ${model} failed:`, error.response?.data?.error?.message || error.message);
    }
  }
  return null;
}

async function testAnthropic() {
  console.log("\n🧪 Testing Anthropic Claude...\n");
  
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  try {
    console.log("🔄 Testing Claude 3 Haiku...");
    
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: "Hello! Give me a brief tip about sustainable fashion."
          }
        ]
      },
      {
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01"
        }
      }
    );
    
    if (response.data?.content?.[0]?.text) {
      console.log("✅ Anthropic Claude working!");
      console.log("Response:", response.data.content[0].text);
      return true;
    }
  } catch (error) {
    console.error("❌ Anthropic failed:", error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  const geminiWorking = await testGemini25Flash();
  const groqModel = await testGroqModels();
  const anthropicWorking = await testAnthropic();
  
  console.log("\n📊 Summary:");
  console.log(`Gemini 2.5 Flash: ${geminiWorking ? '✅ Working' : '❌ Failed'}`);
  console.log(`Groq: ${groqModel ? `✅ Working (${groqModel})` : '❌ Failed'}`);
  console.log(`Anthropic: ${anthropicWorking ? '✅ Working' : '❌ Failed'}`);
  console.log(`OpenAI: ❌ Quota exceeded (expected)`);
}

runTests();