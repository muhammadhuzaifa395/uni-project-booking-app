const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const demoData = require('../config/demoData');

// Protect routes: verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_appointment_system_2026'
      );

      if (mongoose.connection.readyState < 1) {
        req.user =
          demoData.users.find((u) => u._id === decoded.id) || {
            _id: decoded.id,
            name: decoded.id === demoData.users[0]._id ? demoData.users[0].name : 'Client User',
            email: decoded.id === demoData.users[0]._id ? demoData.users[0].email : 'user@appointment.com',
            role: decoded.id === demoData.users[0]._id ? 'admin' : 'user'
          };
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        req.user = demoData.users.find((u) => u._id === decoded.id) || demoData.users[0];
      }

      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required'
    });
  }
};

module.exports = { protect, adminOnly };
