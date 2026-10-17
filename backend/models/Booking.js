const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user']
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: [true, 'Booking must have a provider']
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Booking must have a service']
    },
    date: {
      type: String, // Stored as YYYY-MM-DD
      required: [true, 'Appointment date is required']
    },
    time: {
      type: String, // e.g. "10:00 AM"
      required: [true, 'Appointment time slot is required']
    },
    price: {
      type: Number,
      required: true
    },
    appointmentType: {
      type: String,
      enum: ['In Person', 'Video Call', 'Audio Call'],
      default: 'In Person'
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Confirmed'
    },
    bookingCode: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate human-friendly booking code before save if not provided
bookingSchema.pre('save', function (next) {
  if (!this.bookingCode) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.bookingCode = `BK-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
