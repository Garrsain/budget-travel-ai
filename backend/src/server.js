const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Budget Travel Platform API' });
});

// Import route modules
const searchRoutes = require('./routes/search.routes');
const hotelRoutes = require('./routes/hotel.routes');
const insightsRoutes = require('./routes/insights.routes');
const recommendationsRoutes = require('./routes/recommendations.routes');

// Use routes
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/insights', insightsRoutes);
app.use('/api/v1/recommendations', recommendationsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    // For MVP, we'll use a local MongoDB or MongoDB Atlas
    // In production, use process.env.MONGODB_URI
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/budget_travel';
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  // Connect to database
  // await connectDB(); // Uncomment when ready to connect to MongoDB
});

module.exports = app;
