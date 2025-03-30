/**
 * Recommendations Controller
 * 
 * Handles AI-generated personalized recommendations API endpoints
 */

const recommendationAgent = require('../ai_agents/recommendation.agent');

// Controller methods
exports.getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const { 
      location, 
      budget,
      preferred_amenities,
      min_rating,
      preferred_neighborhoods,
      limit = 5
    } = req.query;
    
    // Validate required parameters
    if (!location) {
      return res.status(400).json({
        status: 'error',
        message: 'Location is required'
      });
    }
    
    // Create user preferences object
    const userPreferences = {
      budget: budget ? parseFloat(budget) : undefined,
      amenities: preferred_amenities ? preferred_amenities.split(',') : ['wifi'],
      min_rating: min_rating ? parseFloat(min_rating) : undefined,
      location_preferences: {
        neighborhoods: preferred_neighborhoods ? preferred_neighborhoods.split(',') : undefined
      }
    };
    
    // Create filters object
    const filters = {
      maxPrice: budget ? parseFloat(budget) * 1.2 : undefined, // Allow slightly above budget
      minRating: min_rating ? parseFloat(min_rating) : undefined,
      minRecommendationScore: 60 // Only include good recommendations
    };
    
    // Get personalized recommendations
    const recommendations = await recommendationAgent.getPersonalizedRecommendations(
      userPreferences,
      location,
      filters
    );
    
    // Limit results
    const limitedRecommendations = recommendations.slice(0, parseInt(limit));
    
    // Format response
    const formattedRecommendations = limitedRecommendations.map(hotel => ({
      hotel_id: hotel.hotel_id,
      name: hotel.name,
      thumbnail: hotel.thumbnail,
      address: {
        city: hotel.address.city,
        country: hotel.address.country,
        neighborhood: hotel.address.neighborhood
      },
      star_rating: hotel.star_rating,
      user_rating: hotel.user_rating,
      price: hotel.price,
      original_price: hotel.original_price,
      currency: hotel.currency,
      recommendation_score: hotel.recommendation_score,
      recommendation_reasons: hotel.recommendation_explanations.map(exp => exp.description)
    }));
    
    // Return results
    res.status(200).json({
      status: 'success',
      count: formattedRecommendations.length,
      recommendations: formattedRecommendations
    });
  } catch (error) {
    next(error);
  }
};
