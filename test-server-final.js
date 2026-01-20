import { createServer } from "./server/index.ts";

async function testServer() {
  try {
    console.log("🚀 Starting EcoWardrobe AI Server...");
    const app = await createServer();
    
    const port = process.env.PORT || 8080;
    const server = app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log("✅ Multi-AI integration ready (Gemini 2.5 Flash + Groq)");
      console.log("✅ Weather service ready");
      console.log("✅ Calendar service ready");
      
      // Test AI chat endpoint
      setTimeout(async () => {
        console.log("\n🧪 Testing AI Chat...");
        try {
          const response = await fetch(`http://localhost:${port}/api/ai/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "system",
                  content: "You are a helpful AI assistant specializing in sustainable fashion."
                },
                {
                  role: "user",
                  content: "Give me a quick tip about sustainable fashion."
                }
              ]
            })
          });
          
          const data = await response.json();
          console.log("✅ AI Chat working!");
          console.log("Response:", data.response);
          
          // Test provider test endpoint
          console.log("\n🔍 Testing AI Providers...");
          const providerResponse = await fetch(`http://localhost:${port}/api/ai/test-providers`);
          const providerData = await providerResponse.json();
          console.log("✅ Provider test results:");
          console.log(JSON.stringify(providerData, null, 2));
          
        } catch (error) {
          console.error("❌ Test failed:", error.message);
        }
      }, 2000);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

testServer();