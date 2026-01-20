import axios from "axios";

async function testPing() {
  console.log("🏓 Testing server ping...");
  
  try {
    const response = await axios.get("http://localhost:8080/api/ping");
    console.log("✅ Server is running!");
    console.log("Response:", response.data);
    
    // Test AI chat
    console.log("\n🤖 Testing AI chat...");
    const chatResponse = await axios.post("http://localhost:8080/api/ai/chat", {
      messages: [
        {
          role: "user",
          content: "Hello! Give me a quick sustainable fashion tip."
        }
      ]
    });
    
    console.log("✅ AI Chat working!");
    console.log("Response:", chatResponse.data.response);
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log("Server is not running yet, please wait...");
    }
  }
}

// Test every 2 seconds for 30 seconds
let attempts = 0;
const maxAttempts = 15;

const testInterval = setInterval(async () => {
  attempts++;
  console.log(`\nAttempt ${attempts}/${maxAttempts}:`);
  
  try {
    await testPing();
    clearInterval(testInterval);
    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    if (attempts >= maxAttempts) {
      console.log("\n⏰ Max attempts reached. Server may not be starting properly.");
      clearInterval(testInterval);
    }
  }
}, 2000);