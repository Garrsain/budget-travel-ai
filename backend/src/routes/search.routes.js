// Create route files for the API endpoints

// Routes for search functionality
const express = require('express');
const router = express.Router();

// Import controllers (to be implemented)
const searchController = require('../controllers/search.controller');

// Define routes
router.get('/hotels', searchController.searchHotels);
router.get('/locations/suggest', searchController.getLocationSuggestions);

module.exports = router;
