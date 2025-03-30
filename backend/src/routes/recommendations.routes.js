// Routes for AI-generated recommendations
const express = require('express');
const router = express.Router();

// Import controllers (to be implemented)
const recommendationsController = require('../controllers/recommendations.controller');

// Define routes
router.get('/', recommendationsController.getPersonalizedRecommendations);

module.exports = router;
