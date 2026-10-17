const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/config/db');

dotenv.config();

// Attempt DB connection (non-blocking)
connectDB().catch((err) => console.log('DB init note:', err.message));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Appointment Booking System API (Vercel Serverless Production)'
  });
});

// Mount Routes
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/users', require('../backend/routes/userRoutes'));
app.use('/api/providers', require('../backend/routes/providerRoutes'));
app.use('/api/services', require('../backend/routes/serviceRoutes'));
app.use('/api/bookings', require('../backend/routes/bookingRoutes'));
app.use('/api/admin', require('../backend/routes/adminRoutes'));

// 404 Handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint Not Found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Serverless Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
