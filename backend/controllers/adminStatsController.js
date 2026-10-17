const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// @desc    Get dashboard metrics & summary
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
      todayBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      recentBookings
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Provider.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ date: today }),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Cancelled' }),
      Booking.find()
        .populate('userId', 'name email')
        .populate('providerId', 'name category image')
        .populate('serviceId', 'name price')
        .sort({ createdAt: -1 })
        .limit(6)
    ]);

    // Calculate revenue from non-cancelled bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Breakdown by category
    const providersByCategory = await Provider.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        todayBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue
      },
      providersByCategory,
      recentBookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dashboard stats'
    });
  }
};

module.exports = { getAdminStats };
