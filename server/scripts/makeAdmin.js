// Script to make a user an admin
// Usage: node scripts/makeAdmin.js <email>

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const makeAdmin = async (email) => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log(`User ${user.username} (${user.email}) is already an admin`);
      process.exit(0);
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully made ${user.username} (${user.email}) an admin!`);
    console.log('User can now access the admin dashboard at /admin');
    
  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.log('Usage: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

makeAdmin(email);
