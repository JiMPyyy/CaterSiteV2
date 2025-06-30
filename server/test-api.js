// Simple API test script
// Run with: node test-api.js
// Make sure the server is running on localhost:3001

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  phone: '7025555555',
  password: 'password123',
  confirmPassword: 'password123'
};

const testSchedule = {
  title: 'Team Lunch Meeting',
  date: '2025-07-15',
  time: '12:00',
  description: 'Monthly team lunch and planning session',
  attendees: 15,
  location: 'Conference Room A'
};

const testOrder = {
  items: [
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      quantity: 2,
      price: 12.99,
      category: 'main',
      dietaryInfo: ['vegetarian']
    },
    {
      name: 'Grilled Chicken Sandwich',
      description: 'Grilled chicken breast with avocado',
      quantity: 3,
      price: 15.99,
      category: 'main'
    }
  ],
  deliveryDate: '2025-07-16',
  deliveryTime: '12:30',
  deliveryAddress: {
    street: '123 Business Ave',
    city: 'Las Vegas',
    state: 'NV',
    zipCode: '89101'
  },
  specialInstructions: 'Please deliver to reception desk'
};

async function runTests() {
  console.log('🚀 Starting CaterVegas API Tests...\n');

  try {
    // Test 1: Basic Server Check
    console.log('1. Testing basic server connection...');
    const basicResponse = await axios.get(`${BASE_URL.replace('/api', '')}/`);
    console.log('✅ Server connection passed:', basicResponse.data);

    // Test 2: Health Check
    console.log('\n2. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: User Registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registration passed:', registerResponse.data.message);
    authToken = registerResponse.data.data.token;

    // Test 3: User Login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    console.log('✅ User login passed:', loginResponse.data.message);

    // Test 4: Get User Profile
    console.log('\n4. Testing get user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get profile passed:', profileResponse.data.data.user.username);

    // Test 5: Create Schedule
    console.log('\n5. Testing create schedule...');
    const scheduleResponse = await axios.post(`${BASE_URL}/schedules`, testSchedule, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Create schedule passed:', scheduleResponse.data.message);
    const scheduleId = scheduleResponse.data.data.schedule._id;

    // Test 6: Get Schedules
    console.log('\n6. Testing get schedules...');
    const schedulesResponse = await axios.get(`${BASE_URL}/schedules`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get schedules passed. Count:', schedulesResponse.data.data.schedules.length);

    // Test 7: Create Order
    console.log('\n7. Testing create order...');
    const orderResponse = await axios.post(`${BASE_URL}/orders`, testOrder, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Create order passed:', orderResponse.data.data.order.orderNumber);
    const orderId = orderResponse.data.data.order._id;

    // Test 8: Get Orders
    console.log('\n8. Testing get orders...');
    const ordersResponse = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get orders passed. Count:', ordersResponse.data.data.orders.length);

    // Test 9: Update Schedule
    console.log('\n9. Testing update schedule...');
    const updateScheduleResponse = await axios.put(`${BASE_URL}/schedules/${scheduleId}`, {
      title: 'Updated Team Lunch Meeting',
      attendees: 20
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update schedule passed:', updateScheduleResponse.data.message);

    // Test 10: Cancel Order
    console.log('\n10. Testing cancel order...');
    const cancelOrderResponse = await axios.put(`${BASE_URL}/orders/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Cancel order passed:', cancelOrderResponse.data.message);

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- Health check: ✅');
    console.log('- User registration: ✅');
    console.log('- User login: ✅');
    console.log('- Get user profile: ✅');
    console.log('- Create schedule: ✅');
    console.log('- Get schedules: ✅');
    console.log('- Create order: ✅');
    console.log('- Get orders: ✅');
    console.log('- Update schedule: ✅');
    console.log('- Cancel order: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Install axios if not already installed
try {
  require('axios');
} catch (e) {
  console.log('Installing axios for testing...');
  require('child_process').execSync('npm install axios', { stdio: 'inherit' });
}

runTests();
