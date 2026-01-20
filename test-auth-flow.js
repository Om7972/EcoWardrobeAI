/**
 * Test Authentication Flow
 * Tests sign-in and profile retrieval
 */

const baseURL = 'http://localhost:3000/api';

async function testAuthFlow() {
  try {
    console.log('🧪 Testing Authentication Flow\n');

    // Test 1: Sign In
    console.log('1️⃣ Testing Sign In...');
    const signInResponse = await fetch(`${baseURL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123',
      }),
    });

    const signInData = await signInResponse.json();
    console.log('Sign In Response:', JSON.stringify(signInData, null, 2));

    if (!signInData.success || !signInData.data?.token) {
      console.error('❌ Sign-in failed or token not returned');
      return;
    }

    const token = signInData.data.token;
    const userId = signInData.data.userId;
    console.log('✅ Sign In successful');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   User ID: ${userId}`);

    // Test 2: Get Profile with Token
    console.log('\n2️⃣ Testing Profile Retrieval with Token...');
    const profileResponse = await fetch(`${baseURL}/protected/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const profileData = await profileResponse.json();
    console.log('Profile Response Status:', profileResponse.status);
    console.log('Profile Response:', JSON.stringify(profileData, null, 2));

    if (profileResponse.status === 200 && profileData.success) {
      console.log('✅ Profile retrieval successful');
      console.log(`   User: ${profileData.data?.name}`);
      console.log(`   Email: ${profileData.data?.email}`);
    } else {
      console.error('❌ Profile retrieval failed');
      return;
    }

    // Test 3: Get Profile without Token
    console.log('\n3️⃣ Testing Profile Retrieval without Token (should fail)...');
    const noTokenResponse = await fetch(`${baseURL}/protected/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('No Token Response Status:', noTokenResponse.status);
    if (noTokenResponse.status === 401) {
      console.log('✅ Correctly rejected request without token');
    } else {
      console.error('❌ Should have rejected request without token');
    }

    console.log('\n✨ All tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run tests
testAuthFlow();
