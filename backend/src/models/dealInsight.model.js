// DealInsight model schema
const mongoose = require('mongoose');

const DealInsightSchema = new mongoose.Schema({
  insight_id: {
    type: String,
    required: true,
    unique: true
  },
  hotel_id: {
    type: String,
    required: true,
    ref: 'Hotel'
  },
  insight_type: {
    type: String,
    enum: ['price_drop', 'good_value', 'seasonal_deal', 'high_rating'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  confidence_score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  supporting_data: {
    price_comparison: mongoose.Schema.Types.Mixed,
    historical_analysis: mongoose.Schema.Types.Mixed
  },
  valid_from: {
    type: Date,
    default: Date.now
  },
  valid_to: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create index for hotel_id to find insights for a specific hotel
DealInsightSchema.index({ hotel_id: 1 });
// Create index for insight_type to find specific types of insights
DealInsightSchema.index({ insight_type: 1 });
// Create index for confidence_score to find high-confidence insights
DealInsightSchema.index({ confidence_score: -1 });
// Create index for validity period
DealInsightSchema.index({ valid_from: 1, valid_to: 1 });

module.exports = mongoose.model('DealInsight', DealInsightSchema);
