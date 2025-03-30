// Hotel model schema
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  hotel_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postal_code: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  star_rating: {
    type: Number,
    min: 1,
    max: 5
  },
  user_rating: {
    type: Number,
    min: 0,
    max: 10
  },
  review_count: {
    type: Number,
    default: 0
  },
  amenities: [String],
  images: [String],
  property_type: String,
  tags: [String],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Create index for geospatial queries
HotelSchema.index({ 'address.coordinates': '2dsphere' });
// Create index for city and country queries
HotelSchema.index({ 'address.city': 1, 'address.country': 1 });
// Create index for star rating and user rating
HotelSchema.index({ star_rating: 1, user_rating: 1 });

module.exports = mongoose.model('Hotel', HotelSchema);
