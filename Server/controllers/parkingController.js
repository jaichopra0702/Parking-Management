// controllers/parkingController.js
const ParkingSpace = require('../models/ParkingSpaceModel');

exports.parkVehicle = async (req, res) => {
  try {
    const { vehicleType, slotNumber, price } = req.body;
    const userId = req.user._id;

    console.log('Parking Vehicle Request:', { vehicleType, slotNumber, price, userId });

    // Validate input
    if (!vehicleType || slotNumber === undefined || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check wallet balance
    const wallet = req.wallet;
    if (!wallet || wallet.balance < price) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Check if the space is already occupied
    const existingOccupancy = await ParkingSpace.findOne({
      vehicleType,
      slotNumber,
      status: 'Occupied'
    });

    if (existingOccupancy) {
      return res.status(400).json({
        success: false,
        message: 'Parking space is already occupied'
      });
    }

    // Create parking record
    const newParking = new ParkingSpace({
      userId,
      vehicleType,
      slotNumber,
      status: 'Occupied',
      parkedAt: new Date()
    });

    // Save parking record
    await newParking.save();

    // Deduct wallet balance
    wallet.balance -= price;
    await wallet.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle parked successfully',
      data: newParking
    });
  } catch (error) {
    console.error('Detailed Parking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      errorDetails: error.message
    });
  }
};

exports.getParkingSpaces = async (req, res) => {
  try {
    // Initialize spaces with 'Available' status
    const spaces = {
      Bike: Array(7).fill('Available'),
      Car: Array(7).fill('Available'),
      Truck: Array(7).fill('Available')
    };

    // Find all currently occupied spaces
    const occupiedSpaces = await ParkingSpace.find({ 
      status: 'Occupied' 
    });

    // Update spaces with occupied status
    occupiedSpaces.forEach(space => {
      // Ensure the slot is marked as 'Occupied' for the specific vehicle type
      spaces[space.vehicleType][space.slotNumber] = 'Occupied';
    });

    // Log for debugging
    console.log('Parking Spaces Status:', spaces);

    res.status(200).json(spaces);
  } catch (error) {
    console.error('Error fetching parking spaces:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking spaces',
      error: error.message
    });
  }
};