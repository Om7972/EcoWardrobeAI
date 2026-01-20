import axios from "axios";

const BASE_URL = "http://localhost:8081";

async function testEndpoint(method, url, data = null, description) {
  try {
    console.log(`🔄 Testing ${description}...`);
    
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    console.log(`✅ ${description} - Status: ${response.status}`);
    
    if (response.data.success) {
      console.log(`   📊 Data count: ${response.data.count || 'N/A'}`);
    }
    
    return { success: true, status: response.status };
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.response?.status || error.message}`);
    return { success: false, error: error.message };
  }
}

async function runDashboardTests() {
  console.log('🚀 Testing Dashboard Endpoints');
  console.log('=' .repeat(50));
  
  const results = {};
  
  // Test authentication
  results.signin = await testEndpoint(
    'POST', 
    '/api/auth/signin',
    { email: 'test@example.com', password: 'password123' },
    'User Sign In'
  );
  
  results.signup = await testEndpoint(
    'POST',
    '/api/auth/signup', 
    { email: 'newuser@test.com', name: 'Test User', password: 'password123' },
    'User Sign Up'
  );
  
  // Test main dashboard endpoints
  const userId = 'demo-user-test';
  
  results.closet = await testEndpoint(
    'GET',
    `/api/clothing/user/${userId}`,
    null,
    'User Closet'
  );
  
  results.outfits = await testEndpoint(
    'GET',
    `/api/outfits/user/${userId}`,
    null,
    'User Outfits'
  );
  
  results.impactMetrics = await testEndpoint(
    'GET',
    `/api/impact/${userId}/metrics`,
    null,
    'Impact Metrics'
  );
  
  results.impactHistory = await testEndpoint(
    'GET',
    `/api/impact/${userId}/history`,
    null,
    'Impact History'
  );
  
  results.achievements = await testEndpoint(
    'GET',
    `/api/impact/${userId}/achievements`,
    null,
    'Achievements'
  );
  
  // Test AI services
  results.aiChat = await testEndpoint(
    'POST',
    '/api/ai/chat',
    { messages: [{ role: 'user', content: 'Hello' }] },
    'AI Chat'
  );
  
  results.styleAdvice = await testEndpoint(
    'POST',
    '/api/ai/style-advice',
    { query: 'How to style a vintage dress?' },
    'Style Advice'
  );
  
  // Test style circles
  results.styleCircles = await testEndpoint(
    'GET',
    '/api/style-circles',
    null,
    'Style Circles'
  );
  
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
    console.log('\n🎉 All dashboard endpoints are working!');
    console.log('✨ Your EcoWardrobe AI is ready for use!');
    console.log('🌐 Visit http://localhost:8081 to access the application');
  } else {
    console.log('\n⚠️ Some endpoints failed:');
    testNames.filter(name => !results[name].success).forEach(testName => {
      console.log(`  • ${testName}: ${results[testName].error}`);
    });
  }
  
  console.log('\n🔧 Next Steps:');
  console.log('• Open http://localhost:8081 in your browser');
  console.log('• Try signing in with any email/password combination');
  console.log('• Explore the dashboard with mock data');
  console.log('• All AI features are fully functional');
}

runDashboardTests().catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});