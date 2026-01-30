// Test if dotenv loads before database connection
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing connection...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Now test the database connection
import mongoose from 'mongoose';

async function test() {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Connected to MongoDB!');
    
    // Check if we can access the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName
    });
  }
}

test();
