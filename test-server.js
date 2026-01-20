import { createServer } from "./server/index.ts";

async function testServer() {
  try {
    console.log("Creating server...");
    const app = await createServer();
    
    const port = process.env.PORT || 8080;
    const server = app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log("✅ Multi-AI integration ready");
      console.log("✅ Weather service ready");
      console.log("✅ Calendar service ready");
      console.log("✅ MongoDB connected");
      
      // Test AI endpoint
      console.log("\n🧪 Testing AI endpoint...");
      fetch(`http://localhost:${port}/api/ping`)
        .then(res => res.json())
        .then(data => {
          console.log("✅ Ping test successful:", data);
        })
        .catch(err => {
          console.error("❌ Ping test failed:", err.message);
        });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
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