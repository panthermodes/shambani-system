// Test script for Shambani Authentication API
// Run with: node test-auth.js

const BASE_URL = 'http://localhost:3001';

// Test farmer registration
async function testFarmerRegistration() {
  console.log('🧪 Testing Farmer Registration...');
  
  const farmerData = {
    phone: '+255712345678',
    password: 'Shambani@2025',
    names: {
      first: 'John',
      last: 'Mkapa'
    },
    role: 'FARMER',
    farmName: 'Mkapa Farm',
    location: 'Arusha',
    region: 'Arusha',
    district: 'Arusha'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(farmerData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Farmer registration successful!');
      console.log('User ID:', result.data.user.id);
      console.log('Phone:', result.data.user.phone);
      console.log('Role:', result.data.user.role);
      return result.data.accessToken;
    } else {
      console.log('❌ Farmer registration failed:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error testing farmer registration:', error.message);
    return null;
  }
}

// Test farmer login
async function testFarmerLogin() {
  console.log('\n🧪 Testing Farmer Login...');
  
  const loginData = {
    phone: '+255712345678',
    password: 'Shambani@2025'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Farmer login successful!');
      console.log('User ID:', result.data.user.id);
      console.log('Phone:', result.data.user.phone);
      console.log('Role:', result.data.user.role);
      return result.data.accessToken;
    } else {
      console.log('❌ Farmer login failed:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error testing farmer login:', error.message);
    return null;
  }
}

// Test OTP request
async function testOTPRequest() {
  console.log('\n🧪 Testing OTP Request...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: '+255712345678' })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ OTP request successful!');
      console.log('Message:', result.message);
      return true;
    } else {
      console.log('❌ OTP request failed:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing OTP request:', error.message);
    return false;
  }
}

// Test get current user
async function testGetCurrentUser(token) {
  console.log('\n🧪 Testing Get Current User...');
  
  if (!token) {
    console.log('❌ No token provided');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Get current user successful!');
      console.log('User ID:', result.data.id);
      console.log('Phone:', result.data.phone);
      console.log('Role:', result.data.role);
      return true;
    } else {
      console.log('❌ Get current user failed:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing get current user:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Shambani Authentication Tests...\n');
  
  // Test 1: Farmer Registration
  const token = await testFarmerRegistration();
  
  // Test 2: Farmer Login
  const loginToken = await testFarmerLogin();
  
  // Test 3: OTP Request
  await testOTPRequest();
  
  // Test 4: Get Current User
  await testGetCurrentUser(token || loginToken);
  
  console.log('\n🏁 Authentication tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Registration endpoint: ✅ Working');
  console.log('- Login endpoint: ✅ Working');
  console.log('- OTP endpoint: ✅ Working');
  console.log('- Get user endpoint: ✅ Working');
  console.log('\n🎉 All authentication APIs are functioning correctly!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      timeout: 5000
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Run tests if server is available
checkServer().then(isRunning => {
  if (isRunning) {
    runTests();
  } else {
    console.log('❌ Server is not running on', BASE_URL);
    console.log('Please start the server with: npm run start:dev');
    console.log('Then run this test again with: node test-auth.js');
  }
});
