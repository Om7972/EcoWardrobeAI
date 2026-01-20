import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("🔍 Environment Variables Debug:");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Not set");
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY ? "✅ Set" : "❌ Not set");
console.log("ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY ? "✅ Set" : "❌ Not set");
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Not set");

console.log("\nFirst few characters:");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY?.substring(0, 10) + "...");
console.log("ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY?.substring(0, 10) + "...");
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.substring(0, 10) + "...");