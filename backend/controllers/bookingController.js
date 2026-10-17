const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Service = require('../models/Service');

// Standard slots for any business day
const DEFAULT_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM'
];

// @desc    Get available slots for a specific provider and date
// @route   GET /api/bookings/available-slots
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { providerId, date } = req.query;

    if (!providerId || !date) {
      return res.status(400).json({
        success: false,
        message: 'providerId and date are required query parameters'
      });
    }

    // Find any existing active bookings for this provider on the given date
    const existingBookings = await Booking.find({
      providerId,
      date,
      status: { $in: ['Pending', 'Confirmed'] }
    }).select('time status');

    const bookedTimes = existingBookings.map((b) => b.time);

    const slotList = DEFAULT_SLOTS.map((time) => ({
      time,
      isBooked: bookedTimes.includes(time)
    }));

    return res.json({
      success: true,
      providerId,
      date,
      slots: slotList,
      bookedCount: bookedTimes.length,
      availableCount: DEFAULT_SLOTS.length - bookedTimes.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new booking (Prevent double-booking!)
// @route   POST /api/bookings
// @access  Private (Registered User)
const createBooking = async (req, res) => {
  try {
    const { providerId, serviceId, date, time, notes, appointmentType } = req.body;

    if (!providerId || !serviceId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide provider, service, date, and time slot'
      });
    }

    // Check if provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // STRICT DOUBLE-BOOKING PREVENTION
    const conflictBooking = await Booking.findOne({
      providerId,
      date,
      time,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (conflictBooking) {
      return res.status(400).json({
        success: false,
        message: `The selected time slot (${time}) on ${date} is already booked. Please choose another available slot.`
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      providerId,
      serviceId,
      date,
      time,
      price: service.price,
      appointmentType: appointmentType || 'In Person',
      notes: notes || '',
      status: 'Confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('providerId', 'name specialty category image location phone')
      .populate('serviceId', 'name price duration category')
      .populate('userId', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing appointment booking'
    });
  }
};

// @desc    Get current user's appointments
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('providerId', 'name specialty category image location phone')
      .populate('serviceId', 'name price duration category')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, category, date, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    let bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name specialty category image location')
      .populate('serviceId', 'name price duration category')
      .sort({ createdAt: -1 });

    // Filter in-memory for deep populated fields like category or search string
    if (category && category !== 'All') {
      bookings = bookings.filter(
        (b) => b.providerId && b.providerId.category === category
      );
    }

    if (search) {
      const s = search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          (b.bookingCode && b.bookingCode.toLowerCase().includes(s)) ||
          (b.userId && b.userId.name.toLowerCase().includes(s)) ||
          (b.userId && b.userId.email.toLowerCase().includes(s)) ||
          (b.providerId && b.providerId.name.toLowerCase().includes(s)) ||
          (b.serviceId && b.serviceId.name.toLowerCase().includes(s))
      );
    }

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name specialty category image location phone email')
      .populate('serviceId', 'name price duration category description');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership unless admin
    if (
      req.user.role !== 'admin' &&
      booking.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    return res.json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Admin or User cancellation)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Normal users can only cancel their own booking
    if (req.user.role !== 'admin') {
      if (booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      if (status !== 'Cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Users can only request cancellation'
        });
      }
    }

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name specialty category image location')
      .populate('serviceId', 'name price duration category');

    return res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updatedBooking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking (Admin only)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
};
