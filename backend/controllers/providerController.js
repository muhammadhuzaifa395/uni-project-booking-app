const Provider = require('../models/Provider');
const Service = require('../models/Service');
const mongoose = require('mongoose');
const demoData = require('../config/demoData');

// @desc    Get all providers
// @route   GET /api/providers
// @access  Public
const getAllProviders = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (mongoose.connection.readyState < 1) {
      let list = [...demoData.providers];
      if (category && category !== 'All') list = list.filter((p) => p.category === category);
      if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase()));
      return res.json({ success: true, count: list.length, providers: list });
    }

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const providers = await Provider.find(query).sort({ rating: -1, createdAt: -1 });

    return res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    let list = [...demoData.providers];
    return res.json({ success: true, count: list.length, providers: list });
  }
};

// @desc    Get single provider by ID
// @route   GET /api/providers/:id
// @access  Public
const getProviderById = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const provider = demoData.providers.find((p) => p._id === req.params.id) || demoData.providers[0];
      return res.json({ success: true, provider });
    }

    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    return res.json({ success: true, provider });
  } catch (error) {
    const provider = demoData.providers[0];
    return res.json({ success: true, provider });
  }
};

// @desc    Create new provider (Admin)
// @route   POST /api/providers
// @access  Private/Admin
const createProvider = async (req, res) => {
  try {
    const { name, email, phone, category, specialty, description, location, image, workingHours, appointmentTypes } = req.body;

    if (!name || !category || !specialty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, and specialty'
      });
    }

    if (mongoose.connection.readyState < 1) {
      const newProv = {
        _id: 'prov_' + Date.now(),
        name,
        email: email || '',
        phone: phone || '',
        category,
        specialty,
        description: description || '',
        location: location || 'City Plaza',
        image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        reviewsCount: 1,
        experience: 'Professional Specialist',
        workingHours: workingHours || { start: '09:00 AM', end: '06:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        appointmentTypes: appointmentTypes || ['In Person']
      };
      demoData.providers.unshift(newProv);
      return res.status(201).json({ success: true, message: 'Provider created', provider: newProv });
    }

    const provider = await Provider.create({
      name,
      email,
      phone,
      category,
      specialty,
      description,
      location,
      image,
      workingHours,
      appointmentTypes
    });

    return res.status(201).json({
      success: true,
      message: 'Provider created successfully',
      provider
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update provider (Admin)
// @route   PUT /api/providers/:id
// @access  Private/Admin
const updateProvider = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const idx = demoData.providers.findIndex((p) => p._id === req.params.id);
      if (idx !== -1) {
        demoData.providers[idx] = { ...demoData.providers[idx], ...req.body };
        return res.json({ success: true, message: 'Provider updated', provider: demoData.providers[idx] });
      }
      return res.json({ success: true, provider: req.body });
    }

    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    return res.json({ success: true, message: 'Provider updated', provider });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete provider (Admin)
// @route   DELETE /api/providers/:id
// @access  Private/Admin
const deleteProvider = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      demoData.providers = demoData.providers.filter((p) => p._id !== req.params.id);
      return res.json({ success: true, message: 'Provider deleted' });
    }

    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    await Service.deleteMany({ providerId: req.params.id });
    return res.json({ success: true, message: 'Provider and linked services deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
};
