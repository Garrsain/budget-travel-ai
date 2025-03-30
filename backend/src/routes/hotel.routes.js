// Routes for hotel details
const express = require('express');
const router = express.Router();

// Import controllers (to be implemented)
const hotelController = require('../controllers/hotel.controller');

// Define routes
router.get('/:id', hotelController.getHotelDetails);

module.exports = router;
