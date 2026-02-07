import mongoose from "mongoose";
import "dotenv/config";

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (mongoose.connection.readyState === 2 || isConnecting) return; // connecting

  isConnecting = true;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  } finally {
    isConnecting = false;
  }
};

export default connectDB;