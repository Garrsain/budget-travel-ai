/**
 * Search Controller
 * 
 * Handles search-related API endpoints
 */

const hotelDealDiscoveryAgent = require('../ai_agents/hotelDealDiscovery.agent');

// Controller methods
exports.searchHotels = async (req, res, next) => {
  try {
    const { location, checkin, checkout, guests, max_price, min_rating, amenities, sort_by, page = 1, limit = 20 } = req.query;
    
    // Validate required parameters
    if (!location) {
      return res.status(400).json({
        status: 'error',
        message: 'Location is required'
      });
    }
    
    // Create filters object
    const filters = {
      maxPrice: max_price ? parseFloat(max_price) : undefined,
      minRating: min_rating ? parseFloat(min_rating) : undefined,
      amenities: amenities ? amenities.split(',') : undefined,
      minDealScore: 0 // Include all deals for now
    };
    
    // Find best deals using AI agent
    const hotels = await hotelDealDiscoveryAgent.findBestDeals(location, filters);
    
    // Apply sorting if specified
    if (sort_by) {
      switch (sort_by) {
        case 'price_low':
          hotels.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          hotels.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          hotels.sort((a, b) => b.user_rating - a.user_rating);
          break;
        case 'best_deal':
        default:
          // Already sorted by deal score
          break;
      }
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedHotels = hotels.slice(startIndex, endIndex);
    
    // Return results
    res.status(200).json({
      status: 'success',
      count: hotels.length,
      page: parseInt(page),
      total_pages: Math.ceil(hotels.length / limit),
      results: paginatedHotels
    });
  } catch (error) {
    next(error);
  }
};

exports.getLocationSuggestions = async (req, res, next) => {
  try {
    const { query, limit = 5 } = req.query;
    
    // Validate required parameters
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Query is required'
      });
    }
    
    // Mock location suggestions for MVP
    const mockSuggestions = [
      { location_id: 'nyc', name: 'New York', type: 'city', country: 'USA' },
      { location_id: 'lon', name: 'London', type: 'city', country: 'UK' },
      { location_id: 'par', name: 'Paris', type: 'city', country: 'France' },
      { location_id: 'tok', name: 'Tokyo', type: 'city', country: 'Japan' },
      { location_id: 'bkk', name: 'Bangkok', type: 'city', country: 'Thailand' }
    ].filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, parseInt(limit));
    
    // Return results
    res.status(200).json({
      status: 'success',
      suggestions: mockSuggestions
    });
  } catch (error) {
    next(error);
  }
};
