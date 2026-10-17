const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  // If in cloud environment and no valid cloud Mongo URI is provided
  if (!mongoUri || mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
    if (process.env.VERCEL) {
      console.log('ℹ️ Running in Vercel Serverless environment. Using integrated database store.');
      return;
    }
  }

  try {
    const conn = await mongoose.connect(
      mongoUri || 'mongodb://127.0.0.1:27017/appointment_booking',
      {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      }
    );
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection note: ${error.message}. System falling back to demo store.`);
  }
};

module.exports = connectDB;
