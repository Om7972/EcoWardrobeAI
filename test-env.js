import dotenv from 'dotenv';

// Load environment variables
const result = dotenv.config();

console.log('🔧 Environment Variable Test');
console.log('=' .repeat(40));

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
  console.log(`📊 Loaded ${Object.keys(result.parsed || {}).length} variables`);
}

console.log('\n📋 Environment Variables:');
console.log('=' .repeat(40));

const envVars = [
  'PING_MESSAGE',
  'JWT_SECRET', 
  'GEMINI_API_KEY',
  'GROQ_API_KEY',
  'MONGODB_URI',
  'PORT',
  'NODE_ENV'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    const maskedValue = varName.includes('KEY') || varName.includes('SECRET') || varName.includes('URI') 
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n🚀 Test Complete');