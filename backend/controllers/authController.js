const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const demoData = require('../config/demoData');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_appointment_system_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    if (mongoose.connection.readyState < 1) {
      const existing = demoData.users.find((u) => u.email === email.toLowerCase().trim());
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }
      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase().trim(),
        phone,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      demoData.users.push(newUser);
      const token = generateToken(newUser._id);
      return res.status(201).json({ success: true, message: 'Registration successful', token, user: newUser });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password,
      role: 'user'
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // In-memory demo fallback for Vercel demo without Atlas
    if (mongoose.connection.readyState < 1) {
      if (cleanEmail === 'admin@appointment.com' && password === 'admin123') {
        const adminUser = demoData.users.find((u) => u.role === 'admin') || demoData.users[0];
        const token = generateToken(adminUser._id);
        return res.json({ success: true, message: 'Logged in successfully', token, user: adminUser });
      }

      if (cleanEmail === 'user@appointment.com' && password === 'user123') {
        const clientUser = demoData.users.find((u) => u.role === 'user') || demoData.users[1];
        const token = generateToken(clientUser._id);
        return res.json({ success: true, message: 'Logged in successfully', token, user: clientUser });
      }

      const match = demoData.users.find((u) => u.email === cleanEmail);
      if (match) {
        const token = generateToken(match._id);
        return res.json({ success: true, message: 'Logged in successfully', token, user: match });
      }

      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Find user in DB
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // Check demo credentials fallback if DB not populated
      if (cleanEmail === 'admin@appointment.com' && password === 'admin123') {
        const adminUser = demoData.users[0];
        const token = generateToken(adminUser._id);
        return res.json({ success: true, message: 'Logged in successfully', token, user: adminUser });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const user = demoData.users.find((u) => u._id === req.user?._id) || req.user || demoData.users[0];
      return res.json({ success: true, user });
    }

    const user = await User.findById(req.user._id).select('-password');
    return res.json({
      success: true,
      user: user || demoData.users[0]
    });
  } catch (error) {
    return res.json({ success: true, user: demoData.users[0] });
  }
};

module.exports = { register, login, getMe };
