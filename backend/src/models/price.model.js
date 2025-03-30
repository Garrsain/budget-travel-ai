// Price model schema
const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  price_id: {
    type: String,
    required: true,
    unique: true
  },
  hotel_id: {
    type: String,
    required: true,
    ref: 'Hotel'
  },
  provider: {
    type: String,
    required: true
  },
  room_type: String,
  date_from: {
    type: Date,
    required: true
  },
  date_to: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  original_price: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  availability: {
    type: Boolean,
    default: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  deal_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  deal_factors: {
    historical_comparison: Number,
    value_assessment: Number,
    seasonal_factor: Number
  }
});

// Create compound index for hotel_id and date range queries
PriceSchema.index({ hotel_id: 1, date_from: 1, date_to: 1 });
// Create index for deal score to find best deals
PriceSchema.index({ deal_score: -1 });
// Create index for timestamp to find recent prices
PriceSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Price', PriceSchema);
