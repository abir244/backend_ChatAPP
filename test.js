// test.js
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing environment...');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Test imports
try {
  const mongoose = await import('mongoose');
  console.log('✅ mongoose imported');
  
  const express = await import('express');
  console.log('✅ express imported');
  
  console.log('\nAll imports successful!');
} catch (error) {
  console.error('Import error:', error.message);
}