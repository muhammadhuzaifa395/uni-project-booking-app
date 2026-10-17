const Provider = require('../models/Provider');
const Service = require('../models/Service');

// @desc    Get all providers (Public with filter/search)
// @route   GET /api/providers
// @access  Public
const getAllProviders = async (req, res) => {
  try {
    const { category, search } = req.query;
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
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching providers'
    });
  }
};

// @desc    Get single provider by ID (Public)
// @route   GET /api/providers/:id
// @access  Public
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // Also fetch associated services for this provider or category
    const services = await Service.find({
      $or: [
        { providerId: provider._id },
        { category: provider.category, providerId: { $exists: false } },
        { category: provider.category, providerId: null }
      ]
    });

    return res.json({
      success: true,
      provider,
      services
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new provider (Admin only)
// @route   POST /api/providers
// @access  Private/Admin
const createProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      category,
      specialty,
      description,
      location,
      image,
      rating,
      experience,
      workingHours,
      appointmentTypes
    } = req.body;

    if (!name || !email || !phone || !category || !specialty || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required provider fields'
      });
    }

    const provider = await Provider.create({
      name,
      email,
      phone,
      category,
      specialty,
      description,
      location,
      image: image || undefined,
      rating: rating || 4.9,
      experience: experience || '5+ years experience',
      workingHours: workingHours || {
        start: '09:00 AM',
        end: '06:00 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      },
      appointmentTypes: appointmentTypes || ['In Person', 'Video Call', 'Audio Call']
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

// @desc    Update provider (Admin only)
// @route   PUT /api/providers/:id
// @access  Private/Admin
const updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    return res.json({
      success: true,
      message: 'Provider updated successfully',
      provider
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete provider (Admin only)
// @route   DELETE /api/providers/:id
// @access  Private/Admin
const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    return res.json({
      success: true,
      message: 'Provider deleted successfully'
    });
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
