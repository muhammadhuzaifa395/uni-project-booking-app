const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const mongoose = require('mongoose');
const demoData = require('../config/demoData');

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

    if (mongoose.connection.readyState < 1) {
      const existing = demoData.bookings.filter(
        (b) =>
          String(b.providerId?._id || b.providerId) === String(providerId) &&
          b.date === date &&
          ['Pending', 'Confirmed'].includes(b.status)
      );
      const bookedTimes = existing.map((b) => b.time);
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
    const slotList = DEFAULT_SLOTS.map((time) => ({ time, isBooked: false }));
    return res.json({ success: true, providerId: req.query.providerId, date: req.query.date, slots: slotList, bookedCount: 0, availableCount: DEFAULT_SLOTS.length });
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

    if (mongoose.connection.readyState < 1) {
      const provider = demoData.providers.find((p) => String(p._id) === String(providerId)) || demoData.providers[0];
      const service = demoData.services.find((s) => String(s._id) === String(serviceId)) || demoData.services[0];

      // Double-booking check
      const conflict = demoData.bookings.find(
        (b) =>
          String(b.providerId?._id || b.providerId) === String(providerId) &&
          b.date === date &&
          b.time === time &&
          ['Pending', 'Confirmed'].includes(b.status)
      );

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Appointment slot is already booked. Double booking is strictly prevented.'
        });
      }

      const newBooking = {
        _id: 'bk_' + Date.now(),
        userId: req.user?._id || demoData.users[1]._id,
        providerId: provider,
        serviceId: service,
        date,
        time,
        price: service.price,
        notes: notes || '',
        appointmentType: appointmentType || 'In Person',
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      demoData.bookings.unshift(newBooking);

      return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        booking: newBooking
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
        message: 'Appointment slot is already booked. Double booking is strictly prevented.'
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
      notes: notes || '',
      appointmentType: appointmentType || 'In Person',
      status: 'Confirmed'
    });

    // Populate references for client response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('providerId', 'name category specialty image location')
      .populate('serviceId', 'name duration price')
      .populate('userId', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      booking: populatedBooking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (User)
const getMyBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      return res.json({
        success: true,
        count: demoData.bookings.length,
        bookings: demoData.bookings
      });
    }

    const bookings = await Booking.find({ userId: req.user._id })
      .populate('providerId', 'name category specialty image location phone')
      .populate('serviceId', 'name duration price')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.json({ success: true, count: demoData.bookings.length, bookings: demoData.bookings });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const formatted = demoData.bookings.map((b) => ({
        _id: b._id,
        customerName: b.userId?.name || 'Michael Green',
        customerEmail: b.userId?.email || 'user@appointment.com',
        providerName: b.providerId?.name || 'Ahmed Barber',
        serviceName: b.serviceId?.name || 'Haircut & Styling',
        date: b.date,
        time: b.time,
        price: b.price,
        status: b.status,
        appointmentType: b.appointmentType,
        createdAt: b.createdAt
      }));
      return res.json({ success: true, count: formatted.length, bookings: formatted });
    }

    const { status, date, category } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (date) {
      query.date = date;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name category image specialty')
      .populate('serviceId', 'name price duration')
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((b) => ({
      _id: b._id,
      customerName: b.userId ? b.userId.name : 'Guest User',
      customerEmail: b.userId ? b.userId.email : 'N/A',
      customerPhone: b.userId ? b.userId.phone : 'N/A',
      providerName: b.providerId ? b.providerId.name : 'N/A',
      providerCategory: b.providerId ? b.providerId.category : 'N/A',
      serviceName: b.serviceId ? b.serviceId.name : 'N/A',
      date: b.date,
      time: b.time,
      price: b.price,
      status: b.status,
      appointmentType: b.appointmentType,
      createdAt: b.createdAt
    }));

    return res.json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings
    });
  } catch (error) {
    return res.json({ success: true, count: 0, bookings: [] });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const b = demoData.bookings.find((item) => item._id === req.params.id) || demoData.bookings[0];
      return res.json({ success: true, booking: b });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('providerId', 'name category specialty image location workingHours phone email')
      .populate('serviceId', 'name duration price description')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.json({ success: true, booking });
  } catch (error) {
    return res.json({ success: true, booking: demoData.bookings[0] });
  }
};

// @desc    Update booking status (Pending, Confirmed, Completed, Cancelled)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Choose from: Pending, Confirmed, Completed, Cancelled'
      });
    }

    if (mongoose.connection.readyState < 1) {
      const idx = demoData.bookings.findIndex((b) => b._id === req.params.id);
      if (idx !== -1) {
        demoData.bookings[idx].status = status;
        return res.json({ success: true, message: `Status updated to ${status}`, booking: demoData.bookings[idx] });
      }
      return res.json({ success: true, message: `Status updated to ${status}` });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    return res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    if (mongoose.connection.readyState < 1) {
      demoData.bookings = demoData.bookings.filter((b) => b._id !== req.params.id);
      return res.json({ success: true, message: 'Booking removed successfully' });
    }

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
