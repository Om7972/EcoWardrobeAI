import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const BASE_URL = "http://localhost:8082";

// Test configuration
const testConfig = {
  timeout: 30000, // 30 seconds timeout
  retries: 2
};

// Test data
const testData = {
  chatMessages: [
    {
      role: "system",
      content: "You are a helpful AI assistant specializing in sustainable fashion."
    },
    {
      role: "user", 
      content: "Give me a brief tip about sustainable fashion."
    }
  ],
  outfitRequest: {
    occasion: "work meeting",
    weather: "cool and cloudy",
    style: "professional",
    items: ["blazer", "blouse", "trousers", "loafers"]
  },
  styleQuery: {
    query: "How can I style a vintage dress for a modern look?",
    context: "I have a 1960s A-line dress"
  },
  fabricAnalysis: {
    fabricDescription: "100% organic cotton with a slight stretch"
  },
  userProfile: {
    stylePreferences: ["sustainable", "minimalist"],
    favoriteColors: ["navy", "white", "beige"],
    lifestyle: "professional"
  },
  weatherLocation: "New York",
  eventDetails: {
    name: "Business Lunch",
    type: "work",
    duration: "2 hours",
    location: "upscale restaurant"
  }
};

// Helper function to make API calls with retry logic
async function makeRequest(url, data, method = 'POST') {
  for (let attempt = 1; attempt <= testConfig.retries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${testConfig.retries}: ${method} ${url}`);
      
      const config = {
        method,
        url: `${BASE_URL}${url}`,
        timeout: testConfig.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (method !== 'GET') {
        config.data = data;
      } else if (data) {
        config.params = data;
      }

      const response = await axios(config);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.response?.data?.error || error.message);
      
      if (attempt === testConfig.retries) {
        return { 
          success: false, 
          error: error.response?.data?.error || error.message,
          status: error.response?.status || 'NETWORK_ERROR'
        };
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Test functions
async function testAIChat() {
  console.log('\n🤖 Testing AI Chat...');
  const result = await makeRequest('/api/ai/chat', {
    messages: testData.chatMessages
  });
  
  if (result.success) {
    console.log('✅ AI Chat working');
    console.log('📝 Response preview:', result.data.response?.substring(0, 100) + '...');
  } else {
    console.log('❌ AI Chat failed:', result.error);
  }
  
  return result;
}

async function testOutfitSuggestion() {
  console.log('\n👗 Testing Outfit Suggestion...');
  const result = await makeRequest('/api/ai/outfit-suggestion', testData.outfitRequest);
  
  if (result.success) {
    console.log('✅ Outfit Suggestion working');
    console.log('📝 Suggestion preview:', result.data.suggestion?.substring(0, 100) + '...');
  } else {
    console.log('❌ Outfit Suggestion failed:', result.error);
  }
  
  return result;
}

async function testStyleAdvice() {
  console.log('\n💡 Testing Style Advice...');
  const result = await makeRequest('/api/ai/style-advice', testData.styleQuery);
  
  if (result.success) {
    console.log('✅ Style Advice working');
    console.log('📝 Advice preview:', result.data.advice?.substring(0, 100) + '...');
  } else {
    console.log('❌ Style Advice failed:', result.error);
  }
  
  return result;
}

async function testFabricAnalysis() {
  console.log('\n🧵 Testing Fabric Analysis...');
  const result = await makeRequest('/api/ai/fabric-analysis', testData.fabricAnalysis);
  
  if (result.success) {
    console.log('✅ Fabric Analysis working');
    console.log('📝 Analysis preview:', result.data.analysis?.substring(0, 100) + '...');
  } else {
    console.log('❌ Fabric Analysis failed:', result.error);
  }
  
  return result;
}

async function testSustainabilityTips() {
  console.log('\n🌱 Testing Sustainability Tips...');
  const result = await makeRequest('/api/ai/sustainability-tips', {
    userProfile: testData.userProfile
  });
  
  if (result.success) {
    console.log('✅ Sustainability Tips working');
    console.log('📝 Tips preview:', result.data.tips?.substring(0, 100) + '...');
  } else {
    console.log('❌ Sustainability Tips failed:', result.error);
  }
  
  return result;
}

async function testWeatherBasedOutfit() {
  console.log('\n🌤️ Testing Weather-based Outfit...');
  const result = await makeRequest('/api/ai/weather-outfit', {
    location: testData.weatherLocation,
    userPreferences: testData.userProfile
  });
  
  if (result.success) {
    console.log('✅ Weather-based Outfit working');
    console.log('📝 Weather:', result.data.weather?.description);
    console.log('📝 Outfit preview:', result.data.outfit?.substring(0, 100) + '...');
  } else {
    console.log('❌ Weather-based Outfit failed:', result.error);
  }
  
  return result;
}

async function testEventBasedStyling() {
  console.log('\n📅 Testing Event-based Styling...');
  const result = await makeRequest('/api/ai/event-styling', {
    eventDetails: testData.eventDetails,
    userWardrobe: testData.userProfile
  });
  
  if (result.success) {
    console.log('✅ Event-based Styling working');
    console.log('📝 Styling preview:', result.data.styling?.substring(0, 100) + '...');
  } else {
    console.log('❌ Event-based Styling failed:', result.error);
  }
  
  return result;
}

async function testWeatherForecast() {
  console.log('\n🌦️ Testing Weather Forecast...');
  const result = await makeRequest('/api/ai/weather-forecast', {
    location: testData.weatherLocation
  }, 'GET');
  
  if (result.success) {
    console.log('✅ Weather Forecast working');
    console.log('📝 Forecast days:', result.data.forecast?.length || 0);
  } else {
    console.log('❌ Weather Forecast failed:', result.error);
  }
  
  return result;
}

async function testCalendarStyling() {
  console.log('\n📆 Testing Calendar Styling...');
  const result = await makeRequest('/api/ai/calendar-styling', {
    days: 3
  }, 'GET');
  
  if (result.success) {
    console.log('✅ Calendar Styling working');
    console.log('📝 Suggestions count:', result.data.suggestions?.length || 0);
  } else {
    console.log('❌ Calendar Styling failed:', result.error);
  }
  
  return result;
}

async function testAIProviders() {
  console.log('\n🔧 Testing AI Providers...');
  const result = await makeRequest('/api/ai/test-providers', {}, 'GET');
  
  if (result.success) {
    console.log('✅ AI Providers test completed');
    console.log('📊 Results:', result.data.summary);
    
    // Show individual provider results
    if (result.data.results) {
      Object.entries(result.data.results).forEach(([provider, providerResult]) => {
        const status = providerResult.status === 'success' ? '✅' : '❌';
        console.log(`  ${status} ${provider}: ${providerResult.status}`);
        if (providerResult.error) {
          console.log(`    Error: ${providerResult.error}`);
        }
      });
    }
  } else {
    console.log('❌ AI Providers test failed:', result.error);
  }
  
  return result;
}

async function testServerHealth() {
  console.log('\n🏥 Testing Server Health...');
  const result = await makeRequest('/api/ping', {}, 'GET');
  
  if (result.success) {
    console.log('✅ Server is healthy');
    console.log('📝 Response:', result.data.message);
  } else {
    console.log('❌ Server health check failed:', result.error);
  }
  
  return result;
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive AI Services Test');
  console.log('=' .repeat(50));
  
  const results = {};
  
  // Test server health first
  results.serverHealth = await testServerHealth();
  
  if (!results.serverHealth.success) {
    console.log('\n❌ Server is not responding. Please start the server first.');
    console.log('Run: npm run dev');
    return;
  }
  
  // Test AI providers
  results.aiProviders = await testAIProviders();
  
  // Test core AI services
  results.aiChat = await testAIChat();
  results.outfitSuggestion = await testOutfitSuggestion();
  results.styleAdvice = await testStyleAdvice();
  results.fabricAnalysis = await testFabricAnalysis();
  results.sustainabilityTips = await testSustainabilityTips();
  
  // Test weather and calendar integration
  results.weatherBasedOutfit = await testWeatherBasedOutfit();
  results.eventBasedStyling = await testEventBasedStyling();
  results.weatherForecast = await testWeatherForecast();
  results.calendarStyling = await testCalendarStyling();
  
  // Generate summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(50));
  
  const testNames = Object.keys(results);
  const successCount = testNames.filter(name => results[name].success).length;
  const totalCount = testNames.length;
  
  console.log(`✅ Passed: ${successCount}/${totalCount} tests`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount} tests`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 All tests passed! Your AI services are working perfectly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.');
  }
  
  // Show failed tests
  const failedTests = testNames.filter(name => !results[name].success);
  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach(testName => {
      console.log(`  • ${testName}: ${results[testName].error}`);
    });
  }
  
  console.log('\n🔧 Next Steps:');
  if (successCount > 0) {
    console.log('• Your AI services are partially working');
    console.log('• Check API keys in .env file for failed services');
    console.log('• Verify network connectivity for external APIs');
  }
  console.log('• Visit http://localhost:8081 to test the frontend');
  console.log('• Check server logs for detailed error information');
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});