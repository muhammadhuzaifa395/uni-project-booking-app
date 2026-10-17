const Service = require('../models/Service');
const mongoose = require('mongoose');
const demoData = require('../config/demoData');

// @desc    Get all services (Public)
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const { category, search, providerId } = req.query;

    if (mongoose.connection.readyState < 1) {
      let list = [...demoData.services];
      if (category && category !== 'All') list = list.filter((s) => s.category === category);
      if (providerId) list = list.filter((s) => s.providerId === providerId);
      if (search) list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
      return res.json({ success: true, count: list.length, services: list });
    }

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (providerId) {
      query.providerId = providerId;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .populate('providerId', 'name specialty rating image location')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    let list = [...demoData.services];
    return res.json({ success: true, count: list.length, services: list });
  }
};

// @desc    Get single service by ID (Public)
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const service = demoData.services.find((s) => s._id === req.params.id) || demoData.services[0];
      return res.json({ success: true, service });
    }

    const service = await Service.findById(req.params.id).populate(
      'providerId',
      'name specialty rating image location workingHours'
    );

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.json({ success: true, service });
  } catch (error) {
    const service = demoData.services[0];
    return res.json({ success: true, service });
  }
};

// @desc    Create new service (Admin)
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { name, category, description, price, duration, image, providerId } = req.body;

    if (!name || !category || !price || !duration || !providerId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, price, duration, and providerId'
      });
    }

    if (mongoose.connection.readyState < 1) {
      const newService = {
        _id: 'srv_' + Date.now(),
        name,
        category,
        description: description || '',
        price: Number(price),
        duration: Number(duration),
        image: image || '',
        providerId
      };
      demoData.services.unshift(newService);
      return res.status(201).json({ success: true, message: 'Service created', service: newService });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price,
      duration,
      image,
      providerId
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service (Admin)
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const idx = demoData.services.findIndex((s) => s._id === req.params.id);
      if (idx !== -1) {
        demoData.services[idx] = { ...demoData.services[idx], ...req.body };
        return res.json({ success: true, message: 'Service updated', service: demoData.services[idx] });
      }
      return res.json({ success: true, service: req.body });
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.json({ success: true, message: 'Service updated', service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service (Admin)
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      demoData.services = demoData.services.filter((s) => s._id !== req.params.id);
      return res.json({ success: true, message: 'Service deleted' });
    }

    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
