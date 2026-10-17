const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter provider name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please enter provider email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please enter provider phone number'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: ['Barber', 'Clinic', 'Private Tutor']
    },
    specialty: {
      type: String,
      required: [true, 'Please specify provider specialty'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a short bio or description'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please specify location/address'],
      trim: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 48
    },
    experience: {
      type: String,
      default: '5+ years experience'
    },
    workingHours: {
      start: { type: String, default: '09:00 AM' },
      end: { type: String, default: '06:00 PM' },
      days: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }
    },
    appointmentTypes: {
      type: [String],
      default: ['In Person', 'Video Call', 'Audio Call']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Provider', providerSchema);
