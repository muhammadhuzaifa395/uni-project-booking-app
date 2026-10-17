const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

// Public slot availability check
router.get('/available-slots', getAvailableSlots);

// User-protected routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);

// Admin-protected routes
router.get('/', protect, adminOnly, getAllBookings);
router.delete('/:id', protect, adminOnly, deleteBooking);

module.exports = router;
