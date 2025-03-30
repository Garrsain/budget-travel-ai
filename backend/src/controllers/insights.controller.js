/**
 * Insights Controller
 * 
 * Handles AI-generated deal insights API endpoints
 */

const hotelDealDiscoveryAgent = require('../ai_agents/hotelDealDiscovery.agent');

// Controller methods
exports.getDealInsights = async (req, res, next) => {
  try {
    const { hotel_id, location, limit = 5 } = req.query;
    
    // If hotel_id is provided, get insights for specific hotel
    if (hotel_id) {
      const insights = await hotelDealDiscoveryAgent.generateHotelDealInsights(hotel_id);
      
      return res.status(200).json({
        status: 'success',
        insights
      });
    }
    
    // If location is provided, get top deals for that location
    if (location) {
      // Get hotels in location
      const hotels = await hotelDealDiscoveryAgent.findBestDeals(location, { minDealScore: 70 });
      
      // Limit results
      const limitedHotels = hotels.slice(0, parseInt(limit));
      
      // Format response
      const topDeals = limitedHotels.map(hotel => ({
        hotel_id: hotel.hotel_id,
        hotel_name: hotel.name,
        thumbnail: hotel.thumbnail,
        price: hotel.price,
        original_price: hotel.original_price,
        currency: hotel.currency,
        deal_score: hotel.deal_score,
        deal_summary: hotel.deal_summary
      }));
      
      return res.status(200).json({
        status: 'success',
        location,
        top_deals: topDeals
      });
    }
    
    // If neither hotel_id nor location is provided
    return res.status(400).json({
      status: 'error',
      message: 'Either hotel_id or location is required'
    });
  } catch (error) {
    next(error);
  }
};
