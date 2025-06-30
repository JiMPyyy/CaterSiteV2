const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/catervegas');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('⚠️  Server will continue running without database connection for testing purposes');
    console.log('💡 To fix this:');
    console.log('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('   2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('   3. Update MONGODB_URI in your .env file');
  }
};

module.exports = connectDB;
