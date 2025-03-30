// Routes for booking functionality
const express = require('express');
const router = express.Router();

// Import controllers
const bookingController = require('../controllers/booking.controller');

// Define routes
router.get('/:hotel_id/link', bookingController.generateBookingLink);
router.get('/:hotel_id/prices', bookingController.getHotelPrices);
router.post('/:hotel_id/track', bookingController.trackBookingConversion);

module.exports = router;
