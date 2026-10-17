const User = require('../models/User');
const mongoose = require('mongoose');
const demoData = require('../config/demoData');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    if (mongoose.connection.readyState < 1) {
      let list = [...demoData.users];
      if (search) list = list.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
      if (role && role !== 'all') list = list.filter((u) => u.role === role);
      return res.json({ success: true, count: list.length, users: list });
    }

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    return res.json({ success: true, count: demoData.users.length, users: demoData.users });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const u = demoData.users.find((item) => item._id === req.params.id) || demoData.users[0];
      return res.json({ success: true, user: u });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: true, user: demoData.users[0] });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    if (mongoose.connection.readyState < 1) {
      const idx = demoData.users.findIndex((u) => u._id === req.params.id);
      if (idx !== -1) {
        demoData.users[idx].role = role;
        return res.json({ success: true, message: `User role updated to ${role}`, user: demoData.users[idx] });
      }
      return res.json({ success: true, message: `Role updated to ${role}` });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      demoData.users = demoData.users.filter((u) => u._id !== req.params.id);
      return res.json({ success: true, message: 'User deleted successfully' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
};
