// src/config/database.js - SIMPLE VERSION
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    
    // Show first part of URI for debugging (but not password)
    const uri = process.env.MONGODB_URI;
    if (uri) {
      const safeUri = uri.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
      console.log('Connecting to:', safeUri.substring(0, 80) + '...');
    }
    
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // More detailed error info
    if (error.name === 'MongooseServerSelectionError') {
      console.log('💡 Tips:');
      console.log('1. Check your internet connection');
      console.log('2. Make sure your IP is whitelisted in MongoDB Atlas');
      console.log('3. Verify username/password are correct');
      console.log('4. Check if cluster is running in Atlas dashboard');
    }
    
    process.exit(1);
  }
};

export default connectDB;
