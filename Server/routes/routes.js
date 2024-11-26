const express = require('express');
const { signUp } = require('../controllers/signup');
const { login } = require('../controllers/login');
const authenticate = require('../middleware/authMiddleware');
const { getUserProfile, updateEmail, changePassword } = require('../controllers/profileController');
const { getWalletBalance, updateWalletBalance } = require('../controllers/walletController');
const contactController = require('../controllers/contactController');
const { parkVehicle, getParkingSpaces } = require('../controllers/parkingController');

const router = express.Router();

// Auth routes
router.post('/signup', signUp);
router.post('/login', login);

// Profile routes (Protected routes)
router.get('/profile', authenticate, getUserProfile);
router.put('/profile/email', authenticate, updateEmail);
router.put('/profile/password', authenticate, changePassword);

// Wallet routes (Protected routes)
router.get('/wallet', authenticate, getWalletBalance);
router.put('/wallet', authenticate, updateWalletBalance);

// Contact routes
router.post('/contact', contactController.submitContactForm);

// Parking routes (Protected routes)
router.post('/park-vehicle', authenticate, parkVehicle);
router.get('/parking-spaces', authenticate, getParkingSpaces);

module.exports = router;