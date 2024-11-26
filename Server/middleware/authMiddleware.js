// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet'); // Add Wallet import

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password for security
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get or create wallet for the user
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: user._id,
        balance: 0 // Initialize balance if wallet doesn't exist
      });
    }

    // Attach user and wallet to the request object
    req.user = user;
    req.wallet = wallet;
    
    next();
    
  } catch (error) {
    console.error('Auth error:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    // Handle general errors
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

module.exports = authenticate;
