// Routes for AI-generated deal insights
const express = require('express');
const router = express.Router();

// Import controllers (to be implemented)
const insightsController = require('../controllers/insights.controller');

// Define routes
router.get('/deals', insightsController.getDealInsights);

module.exports = router;
