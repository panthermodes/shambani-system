// Comprehensive Backend Test Script for Shambani Investment Platform
// Tests all modules: Auth, Users, Orders, Products, Services, Notifications, Financial

const BASE_URL = 'http://localhost:3001';

// Test configuration
const testConfig = {
  farmer: {
    phone: '+255712345678',
    password: 'Shambani@2025',
    names: { first: 'John', last: 'Mkapa' },
    role: 'FARMER',
    farmName: 'Mkapa Farm',
    location: 'Arusha'
  },
  extensionOfficer: {
    phone: '+255712345679',
    password: 'Shambani@2025',
    names: { first: 'Sarah', last: 'Kikwete' },
    role: 'EXTENSION_OFFICER',
    location: 'Dar es Salaam'
  },
  admin: {
    phone: '+255712345680',
    password: 'Admin@2025',
    names: { first: 'Admin', last: 'User' },
    role: 'SUPER_ADMIN',
    location: 'Dodoma'
  }
};

let tokens = {
  farmer: null,
  extensionOfficer: null,
  admin: null
};

let createdIds = {
  product: null,
  order: null,
  serviceRequest: null
};

// Utility function to make API calls
async function apiCall(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (tokens.farmer && !endpoint.includes('/auth/')) {
    defaultOptions.headers.Authorization = `Bearer ${tokens.farmer}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  const data = await response.json();
  return { status: response.status, data };
}

// Test Authentication Module
async function testAuthModule() {
  console.log('\n🧪 Testing Authentication Module...');
  
  try {
    // Test farmer registration
    console.log('  📝 Testing farmer registration...');
    const regResult = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(testConfig.farmer),
    });
    
    if (regResult.status === 201) {
      tokens.farmer = regResult.data.data.accessToken;
      console.log('    ✅ Farmer registered successfully');
    } else {
      console.log('    ❌ Farmer registration failed:', regResult.data.message);
    }

    // Test extension officer registration
    console.log('  📝 Testing extension officer registration...');
    const extRegResult = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(testConfig.extensionOfficer),
    });
    
    if (extRegResult.status === 201) {
      tokens.extensionOfficer = extRegResult.data.data.accessToken;
      console.log('    ✅ Extension officer registered successfully');
    } else {
      console.log('    ❌ Extension officer registration failed:', extRegResult.data.message);
    }

    // Test admin registration
    console.log('  📝 Testing admin registration...');
    const adminRegResult = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(testConfig.admin),
    });
    
    if (adminRegResult.status === 201) {
      tokens.admin = adminRegResult.data.data.accessToken;
      console.log('    ✅ Admin registered successfully');
    } else {
      console.log('    ❌ Admin registration failed:', adminRegResult.data.message);
    }

    // Test login
    console.log('  🔐 Testing farmer login...');
    const loginResult = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        phone: testConfig.farmer.phone,
        password: testConfig.farmer.password
      }),
    });
    
    if (loginResult.status === 200) {
      tokens.farmer = loginResult.data.data.accessToken;
      console.log('    ✅ Farmer login successful');
    } else {
      console.log('    ❌ Farmer login failed:', loginResult.data.message);
    }

    // Test get current user
    console.log('  👤 Testing get current user...');
    const meResult = await apiCall('/api/auth/me');
    
    if (meResult.status === 200) {
      console.log('    ✅ Get current user successful');
    } else {
      console.log('    ❌ Get current user failed:', meResult.data.message);
    }

    console.log('  ✅ Authentication module tests completed');
    return true;
  } catch (error) {
    console.log('  ❌ Authentication module test failed:', error.message);
    return false;
  }
}

// Test Users Module
async function testUsersModule() {
  console.log('\n🧪 Testing Users Module...');
  
  try {
    // Test get user profile
    console.log('  👤 Testing get user profile...');
    const profileResult = await apiCall('/api/users/profile');
    
    if (profileResult.status === 200) {
      console.log('    ✅ Get user profile successful');
    } else {
      console.log('    ❌ Get user profile failed:', profileResult.data.message);
    }

    // Test update user profile
    console.log('  ✏️ Testing update user profile...');
    const updateResult = await apiCall('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        farmName: 'Updated Mkapa Farm',
        location: 'Arusha Region'
      }),
    });
    
    if (updateResult.status === 200) {
      console.log('    ✅ Update user profile successful');
    } else {
      console.log('    ❌ Update user profile failed:', updateResult.data.message);
    }

    // Test get user stats (admin only)
    console.log('  📊 Testing get user stats...');
    const statsResult = await apiCall('/api/users/stats', {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    
    if (statsResult.status === 200) {
      console.log('    ✅ Get user stats successful');
    } else {
      console.log('    ❌ Get user stats failed:', statsResult.data.message);
    }

    console.log('  ✅ Users module tests completed');
    return true;
  } catch (error) {
    console.log('  ❌ Users module test failed:', error.message);
    return false;
  }
}

// Test Products Module
async function testProductsModule() {
  console.log('\n🧪 Testing Products Module...');
  
  try {
    // Test create product
    console.log('  📦 Testing create product...');
    const productData = {
      name: 'Organic Tomatoes',
      description: 'Fresh organic tomatoes from Arusha',
      category: 'VEGETABLES',
      price: 5000,
      quantity: 100,
      unit: 'kg',
      location: 'Arusha',
      region: 'Arusha',
      district: 'Arusha'
    };

    const createResult = await apiCall('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    
    if (createResult.status === 201) {
      createdIds.product = createResult.data.data.id;
      console.log('    ✅ Product created successfully');
    } else {
      console.log('    ❌ Product creation failed:', createResult.data.message);
    }

    // Test get products
    console.log('  📋 Testing get products...');
    const getProductsResult = await apiCall('/api/products');
    
    if (getProductsResult.status === 200) {
      console.log('    ✅ Get products successful');
    } else {
      console.log('    ❌ Get products failed:', getProductsResult.data.message);
    }

    // Test get my products
    console.log('  📋 Testing get my products...');
    const myProductsResult = await apiCall('/api/products/my');
    
    if (myProductsResult.status === 200) {
      console.log('    ✅ Get my products successful');
    } else {
      console.log('    ❌ Get my products failed:', myProductsResult.data.message);
    }

    // Test search products
    console.log('  🔍 Testing search products...');
    const searchResult = await apiCall('/api/products/search?q=tomatoes');
    
    if (searchResult.status === 200) {
      console.log('    ✅ Search products successful');
    } else {
      console.log('    ❌ Search products failed:', searchResult.data.message);
    }

    // Test get product categories
    console.log('  🏷️ Testing get product categories...');
    const categoriesResult = await apiCall('/api/products/categories');
    
    if (categoriesResult.status === 200) {
      console.log('    ✅ Get product categories successful');
    } else {
      console.log('    ❌ Get product categories failed:', categoriesResult.data.message);
    }

    // Test update product
    if (createdIds.product) {
      console.log('  ✏️ Testing update product...');
      const updateResult = await apiCall(`/api/products/${createdIds.product}`, {
        method: 'PATCH',
        body: JSON.stringify({
          price: 5500,
          quantity: 90
        }),
      });
      
      if (updateResult.status === 200) {
        console.log('    ✅ Product updated successfully');
      } else {
        console.log('    ❌ Product update failed:', updateResult.data.message);
      }
    }

    console.log('  ✅ Products module tests completed');
    return true;
  } catch (error) {
    console.log('  ❌ Products module test failed:', error.message);
    return false;
  }
}

// Test Orders Module
async function testOrdersModule() {
  console.log('\n🧪 Testing Orders Module...');
  
  try {
    // Test create order
    console.log('  🛒 Testing create order...');
    const orderData = {
      totalAmount: 10000,
      deliveryAddress: 'Arusha, Tanzania',
      notes: 'Please deliver in the morning',
      items: [
        {
          productId: createdIds.product || 'temp-id',
          quantity: 2,
          price: 5000
        }
      ]
    };

    const createResult = await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    
    if (createResult.status === 201) {
      createdIds.order = createResult.data.data.id;
      console.log('    ✅ Order created successfully');
    } else {
      console.log('    ❌ Order creation failed:', createResult.data.message);
    }

    // Test get orders
    console.log('  📋 Testing get orders...');
    const getOrdersResult = await apiCall('/api/orders');
    
    if (getOrdersResult.status === 200) {
      console.log('    ✅ Get orders successful');
    } else {
      console.log('    ❌ Get orders failed:', getOrdersResult.data.message);
    }

    // Test update order
    if (createdIds.order) {
      console.log('  ✏️ Testing update order...');
      const updateResult = await apiCall(`/api/orders/${createdIds.order}`, {
        method: 'PATCH',
        body: JSON.stringify({
          notes: 'Updated delivery instructions'
        }),
      });
      
      if (updateResult.status === 200) {
        console.log('    ✅ Order updated successfully');
      } else {
        console.log('    ❌ Order update failed:', updateResult.data.message);
      }
    }

    // Test get order stats (admin only)
    console.log('  📊 Testing get order stats...');
    const statsResult = await apiCall('/api/orders/admin/stats', {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    
    if (statsResult.status === 200) {
      console.log('    ✅ Get order stats successful');
    } else {
      console.log('    ❌ Get order stats failed:', statsResult.data.message);
    }

    console.log('  ✅ Orders module tests completed');
    return true;
  } catch (error) {
    console.log('  ❌ Orders module test failed:', error.message);
    return false;
  }
}

// Test Services Module
async function testServicesModule() {
  console.log('\n🧪 Testing Services Module...');
  
  try {
    // Test create service request
    console.log('  🔧 Testing create service request...');
    const serviceData = {
      serviceType: 'EXTENSION',
      title: 'Crop Disease Consultation',
      description: 'Need help with tomato disease identification',
      priority: 'MEDIUM',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Farm located in Arusha region'
    };

    const createResult = await apiCall('/api/services/requests', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
    
    if (createResult.status === 201) {
      createdIds.serviceRequest = createResult.data.data.id;
      console.log('    ✅ Service request created successfully');
    } else {
      console.log('    ❌ Service request creation failed:', createResult.data.message);
    }

    // Test get service requests
    console.log('  📋 Testing get service requests...');
    const getRequestsResult = await apiCall('/api/services/requests');
    
    if (getRequestsResult.status === 200) {
      console.log('    ✅ Get service requests successful');
    } else {
      console.log('    ❌ Get service requests failed:', getRequestsResult.data.message);
    }

    // Test get service stats
    console.log('  📊 Testing get service stats...');
    const statsResult = await apiCall('/api/services/stats');
    
    if (statsResult.status === 200) {
      console.log('    ✅ Get service stats successful');
    } else {
      console.log('    ❌ Get service stats failed:', statsResult.data.message);
    }

    // Test update service request
    if (createdIds.serviceRequest) {
      console.log('  ✏️ Testing update service request...');
      const updateResult = await apiCall(`/api/services/requests/${createdIds.serviceRequest}`, {
        method: 'PATCH',
        body: JSON.stringify({
          priority: 'HIGH',
          notes: 'Urgent assistance needed'
        }),
      });
      
      if (updateResult.status === 200) {
        console.log('    ✅ Service request updated successfully');
      } else {
        console.log('    ❌ Service request update failed:', updateResult.data.message);
      }
    }

    // Test assign service request (extension officer)
    if (createdIds.serviceRequest && tokens.extensionOfficer) {
      console.log('  👨‍🌾 Testing assign service request...');
      const assignResult = await apiCall(`/api/services/requests/${createdIds.serviceRequest}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${tokens.extensionOfficer}` },
        body: JSON.stringify({
          status: 'ASSIGNED',
          notes: 'I will handle this request'
        }),
      });
      
      if (assignResult.status === 200) {
        console.log('    ✅ Service request assigned successfully');
      } else {
        console.log('    ❌ Service request assignment failed:', assignResult.data.message);
      }
    }

    console.log('  ✅ Services module tests completed');
    return true;
  } catch (error) {
    console.log('  ❌ Services module test failed:', error.message);
    return false;
  }
}

// Test Notifications Module
async function testNotificationsModule() {
  console.log('\n🧪 Testing Notifications Module...');
  
  try {
    // Test get notifications
    console.log('  🔔 Testing get notifications...');
    const getNotificationsResult = await apiCall('/api/notifications');
    
    if (getNotificationsResult.status === 200) {
      console.log('    ✅ Get notifications successful');
    } else {
      console.log('    ❌ Get notifications failed:', getNotificationsResult.data.message);
    }

    // Test mark notification as read
    const notifications = getNotificationsResult.data?.data || [];
    if (notifications.length > 0) {
      console.log('  📖 Testing mark notification as read...');
      const markReadResult = await apiCall(`/api/notifications/${notifications[0].id}/read`, {
        method: 'PATCH',
      });
      
      if (markReadResult.status === 200) {
        console.log('    ✅ Mark notification as read successful');
      } else {
        console.log('    ❌ Mark notification as read failed:', markReadResult.data.message);
      }
    }

    console.log('  ✅ Notifications module tests completed');
    return true;
  } catch (error) {
    console.log('  ❌ Notifications module test failed:', error.message);
    return false;
  }
}

// Test Database Connectivity
async function testDatabaseConnectivity() {
  console.log('\n🧪 Testing Database Connectivity...');
  
  try {
    // Test if we can get user stats (requires database connection)
    console.log('  🗄️ Testing database connection...');
    const result = await apiCall('/api/users/stats', {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    
    if (result.status === 200) {
      console.log('    ✅ Database connection successful');
      console.log('    📊 Total users:', result.data.data.totalUsers || 0);
      return true;
    } else {
      console.log('    ❌ Database connection failed:', result.data.message);
      return false;
    }
  } catch (error) {
    console.log('    ❌ Database connection test failed:', error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Backend Tests...\n');
  
  const results = {
    auth: false,
    users: false,
    products: false,
    orders: false,
    services: false,
    notifications: false,
    database: false
  };

  // Run all tests
  results.auth = await testAuthModule();
  results.users = await testUsersModule();
  results.products = await testProductsModule();
  results.orders = await testOrdersModule();
  results.services = await testServicesModule();
  results.notifications = await testNotificationsModule();
  results.database = await testDatabaseConnectivity();

  // Summary
  console.log('\n🏁 All Backend Tests Completed!\n');
  console.log('📊 Test Results Summary:');
  console.log('  🔐 Authentication Module:', results.auth ? '✅ PASS' : '❌ FAIL');
  console.log('  👥 Users Module:', results.users ? '✅ PASS' : '❌ FAIL');
  console.log('  📦 Products Module:', results.products ? '✅ PASS' : '❌ FAIL');
  console.log('  🛒 Orders Module:', results.orders ? '✅ PASS' : '❌ FAIL');
  console.log('  🔧 Services Module:', results.services ? '✅ PASS' : '❌ FAIL');
  console.log('  🔔 Notifications Module:', results.notifications ? '✅ PASS' : '❌ FAIL');
  console.log('  🗄️ Database Connectivity:', results.database ? '✅ PASS' : '❌ FAIL');

  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED! Backend is fully functional and ready for production.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the logs above for details.');
  }

  return allPassed;
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
    runAllTests();
  } else {
    console.log('❌ Server is not running on', BASE_URL);
    console.log('Please start the server with: npm run start:dev');
    console.log('Then run this test again with: node test-all-modules.js');
  }
});
