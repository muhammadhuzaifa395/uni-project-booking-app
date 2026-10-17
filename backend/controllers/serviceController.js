const Service = require('../models/Service');

// @desc    Get all services (Public)
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const { category, search, providerId } = req.query;
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
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching services'
    });
  }
};

// @desc    Get single service by ID (Public)
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      'providerId',
      'name specialty rating image location workingHours'
    );

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new service (Admin only)
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { name, category, description, price, duration, image, providerId } = req.body;

    if (!name || !category || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, description and price'
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price: Number(price),
      duration: Number(duration) || 30,
      image: image || undefined,
      providerId: providerId || undefined
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

// @desc    Update service (Admin only)
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service (Admin only)
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.json({
      success: true,
      message: 'Service deleted successfully'
    });
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
