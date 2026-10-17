const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter service name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify service category'],
      enum: ['Barber', 'Clinic', 'Private Tutor']
    },
    description: {
      type: String,
      required: [true, 'Please enter service description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please specify price in USD'],
      min: 0
    },
    duration: {
      type: Number,
      required: [true, 'Please specify duration in minutes'],
      default: 30
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80'
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Service', serviceSchema);
