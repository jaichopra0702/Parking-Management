const mongoose = require('mongoose');
const ParkingSpaceSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['Bike', 'Car', 'Truck'],
    required: true
  },
  slotNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied'],
    default: 'Occupied'
  },
  parkedAt: {
    type: Date,
    default: Date.now
  }
});

// Remove any unique index on `slotNumber` programmatically
ParkingSpaceSchema.index({ vehicleType: 1, slotNumber: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('ParkingSpace', ParkingSpaceSchema);
