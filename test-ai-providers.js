import axios from "axios";

async function testAIProviders() {
  const baseURL = "http://localhost:8080";
  
  console.log("🧪 Testing AI Providers...\n");
  
  try {
    // Test the AI provider test endpoint
    console.log("📡 Calling AI provider test endpoint...");
    const response = await axios.get(`${baseURL}/api/ai/test-providers`);
    
    console.log("✅ Test Results:");
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    
    // Try individual chat test
    console.log("\n🔄 Trying individual chat test...");
    try {
      const chatResponse = await axios.post(`${baseURL}/api/ai/chat`, {
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant specializing in sustainable fashion."
          },
          {
            role: "user",
            content: "Hello, can you give me a brief tip about sustainable fashion?"
          }
        ]
      });
      
      console.log("✅ Chat test successful:");
      console.log("Response:", chatResponse.data.response);
      
    } catch (chatError) {
      console.error("❌ Chat test failed:", chatError.message);
      if (chatError.response) {
        console.error("Response data:", chatError.response.data);
      }
    }
  }
}

// Wait a bit for server to start, then test
setTimeout(testAIProviders, 3000);