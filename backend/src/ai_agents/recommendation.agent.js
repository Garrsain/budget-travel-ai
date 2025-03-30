/**
 * Recommendation AI Agent
 * 
 * This agent provides personalized hotel recommendations for budget travelers
 * based on their preferences, search patterns, and budget constraints.
 * 
 * It focuses on finding hotels that match the specific needs of budget travelers,
 * prioritizing essential amenities, convenient locations, and good value.
 */

const axios = require('axios');
const Hotel = require('../models/hotel.model');
const Price = require('../models/price.model');
const hotelDealDiscoveryAgent = require('./hotelDealDiscovery.agent');

class RecommendationAgent {
  /**
   * Generate personalized hotel recommendations
   * @param {Object} userPreferences - User preferences and search history
   * @param {String} location - Target location
   * @param {Object} filters - Additional filters
   * @returns {Array} Recommended hotels with explanation
   */
  async getPersonalizedRecommendations(userPreferences, location, filters = {}) {
    try {
      // Get available hotels in the location
      const availableHotels = await this.getHotelsInLocation(location);
      
      // Score each hotel based on user preferences
      const scoredHotels = await this.scoreHotelsForUser(availableHotels, userPreferences);
      
      // Apply filters
      const filteredHotels = this.applyFilters(scoredHotels, filters);
      
      // Sort by recommendation score (descending)
      filteredHotels.sort((a, b) => b.recommendation_score - a.recommendation_score);
      
      // Generate recommendation explanations
      const recommendationsWithExplanations = this.generateRecommendationExplanations(
        filteredHotels,
        userPreferences
      );
      
      return recommendationsWithExplanations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Score hotels based on user preferences
   * @param {Array} hotels - Available hotels
   * @param {Object} userPreferences - User preferences
   * @returns {Array} Hotels with recommendation scores
   */
  async scoreHotelsForUser(hotels, userPreferences) {
    const scoredHotels = [];
    
    for (const hotel of hotels) {
      // Get current price
      const priceData = await this.getCurrentPrice(hotel.hotel_id);
      
      // Calculate individual factor scores
      const budgetScore = this.calculateBudgetScore(priceData.price, userPreferences.budget);
      const amenityScore = this.calculateAmenityScore(hotel.amenities, userPreferences.amenities);
      const locationScore = this.calculateLocationScore(hotel.address, userPreferences.location_preferences);
      const ratingScore = this.calculateRatingScore(hotel.user_rating, hotel.star_rating, userPreferences.min_rating);
      
      // Get deal score from Deal Discovery Agent
      const dealScore = await this.getDealScore(hotel, priceData);
      
      // Calculate overall recommendation score (weighted average)
      const recommendationScore = Math.round(
        (budgetScore * 0.3) + 
        (amenityScore * 0.2) + 
        (locationScore * 0.15) + 
        (ratingScore * 0.15) + 
        (dealScore * 0.2)
      );
      
      scoredHotels.push({
        ...hotel,
        price: priceData.price,
        original_price: priceData.original_price,
        currency: priceData.currency,
        recommendation_score: recommendationScore,
        factor_scores: {
          budget: budgetScore,
          amenities: amenityScore,
          location: locationScore,
          rating: ratingScore,
          deal: dealScore
        }
      });
    }
    
    return scoredHotels;
  }
  
  /**
   * Calculate score based on how well the price matches the user's budget
   * @param {Number} price - Hotel price
   * @param {Number} budget - User's budget
   * @returns {Number} Score from 0-100
   */
  calculateBudgetScore(price, budget) {
    if (!budget) {
      return 50; // Neutral score if no budget specified
    }
    
    // Calculate how much below budget the price is (as percentage of budget)
    const budgetDifference = (budget - price) / budget;
    
    // Convert to score (0-100)
    // If price is at budget, score 70
    // If price is 30% or more below budget, score 100
    // If price is above budget, score decreases rapidly
    let score;
    
    if (price <= budget) {
      // Price is within budget
      score = 70 + (budgetDifference * 100);
    } else {
      // Price is above budget
      const overBudgetPercentage = (price - budget) / budget;
      score = Math.max(0, 70 - (overBudgetPercentage * 200));
    }
    
    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate score based on how well the hotel's amenities match user preferences
   * @param {Array} hotelAmenities - Hotel's amenities
   * @param {Array} preferredAmenities - User's preferred amenities
   * @returns {Number} Score from 0-100
   */
  calculateAmenityScore(hotelAmenities, preferredAmenities) {
    if (!preferredAmenities || preferredAmenities.length === 0) {
      return 50; // Neutral score if no preferences
    }
    
    // Count how many preferred amenities are available
    let matchCount = 0;
    for (const amenity of preferredAmenities) {
      if (hotelAmenities.includes(amenity)) {
        matchCount++;
      }
    }
    
    // Calculate percentage of preferred amenities available
    const matchPercentage = matchCount / preferredAmenities.length;
    
    // Convert to score (0-100)
    // 100% match = score 100
    // 0% match = score 0
    return Math.round(matchPercentage * 100);
  }
  
  /**
   * Calculate score based on location factors
   * @param {Object} hotelAddress - Hotel's address
   * @param {Object} locationPreferences - User's location preferences
   * @returns {Number} Score from 0-100
   */
  calculateLocationScore(hotelAddress, locationPreferences) {
    if (!locationPreferences) {
      return 50; // Neutral score if no preferences
    }
    
    // For MVP, use a simplified scoring system
    // In a real implementation, this would use geospatial calculations
    
    let score = 50; // Start with neutral score
    
    // Check if hotel is in preferred neighborhood
    if (locationPreferences.neighborhoods && 
        locationPreferences.neighborhoods.includes(hotelAddress.neighborhood)) {
      score += 25;
    }
    
    // Check if hotel is near public transportation (for budget travelers)
    if (hotelAddress.near_public_transport) {
      score += 25;
    }
    
    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate score based on ratings
   * @param {Number} userRating - Hotel's user rating
   * @param {Number} starRating - Hotel's star rating
   * @param {Number} minRating - User's minimum acceptable rating
   * @returns {Number} Score from 0-100
   */
  calculateRatingScore(userRating, starRating, minRating) {
    if (!minRating) {
      // If no minimum specified, use a default scoring based on absolute rating
      return Math.min(100, Math.round((userRating / 10) * 100));
    }
    
    // Calculate how much above minimum the rating is
    const ratingDifference = userRating - minRating;
    
    // Convert to score (0-100)
    // If rating is at minimum, score 50
    // If rating is 2 points above minimum, score 100
    // If rating is below minimum, score 0
    let score;
    
    if (userRating >= minRating) {
      score = 50 + (ratingDifference * 25);
    } else {
      score = 0;
    }
    
    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Get deal score from Deal Discovery Agent
   * @param {Object} hotel - Hotel data
   * @param {Object} priceData - Current price data
   * @returns {Number} Deal score from 0-100
   */
  async getDealScore(hotel, priceData) {
    try {
      // In a real implementation, this would call the Deal Discovery Agent
      // For MVP, use a simplified approach
      
      // If hotel has a deal_score property, use it
      if (hotel.deal_score !== undefined) {
        return hotel.deal_score;
      }
      
      // If price has a significant discount from original price
      if (priceData.original_price && priceData.price < priceData.original_price) {
        const discountPercentage = ((priceData.original_price - priceData.price) / priceData.original_price) * 100;
        return Math.min(100, Math.round(50 + discountPercentage));
      }
      
      // Default score based on star rating and price
      // Lower price for the star rating = better deal
      const pricePerStar = priceData.price / (hotel.star_rating || 1);
      
      // Score based on price per star (lower is better)
      // $20 per star or less = score 100
      // $60 per star or more = score 0
      const score = 100 - Math.min(100, Math.round((pricePerStar - 20) * (100 / 40)));
      
      return Math.max(0, score);
    } catch (error) {
      console.error('Error getting deal score:', error);
      return 50; // Neutral score on error
    }
  }
  
  /**
   * Apply filters to scored hotels
   * @param {Array} scoredHotels - Hotels with recommendation scores
   * @param {Object} filters - Filters to apply
   * @returns {Array} Filtered hotels
   */
  applyFilters(scoredHotels, filters) {
    return scoredHotels.filter(hotel => {
      // Apply price filter
      if (filters.maxPrice && hotel.price > filters.maxPrice) {
        return false;
      }
      
      // Apply rating filter
      if (filters.minRating && hotel.user_rating < filters.minRating) {
        return false;
      }
      
      // Apply amenity filters
      if (filters.amenities && filters.amenities.length > 0) {
        for (const amenity of filters.amenities) {
          if (!hotel.amenities.includes(amenity)) {
            return false;
          }
        }
      }
      
      // Apply minimum recommendation score filter
      if (filters.minRecommendationScore && 
          hotel.recommendation_score < filters.minRecommendationScore) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * Generate personalized explanations for recommendations
   * @param {Array} scoredHotels - Hotels with recommendation scores
   * @param {Object} userPreferences - User preferences
   * @returns {Array} Hotels with recommendation explanations
   */
  generateRecommendationExplanations(scoredHotels, userPreferences) {
    return scoredHotels.map(hotel => {
      const explanations = [];
      const factorScores = hotel.factor_scores;
      
      // Generate explanation based on highest scoring factors
      
      // Budget explanation
      if (factorScores.budget > 80) {
        if (userPreferences.budget && hotel.price < userPreferences.budget * 0.8) {
          explanations.push({
            type: 'budget',
            description: `Well below your budget (${Math.round((userPreferences.budget - hotel.price) / userPreferences.budget * 100)}% savings)`
          });
        } else {
          explanations.push({
            type: 'budget',
            description: 'Great value for budget travelers'
          });
        }
      }
      
      // Amenity explanation
      if (factorScores.amenities > 80 && userPreferences.amenities) {
        const matchCount = userPreferences.amenities.filter(amenity => 
          hotel.amenities.includes(amenity)
        ).length;
        
        if (matchCount === userPreferences.amenities.length) {
          explanations.push({
            type: 'amenities',
            description: 'Has all your preferred amenities'
          });
        } else if (matchCount > 0) {
          explanations.push({
            type: 'amenities',
            description: `Has ${matchCount} of your ${userPreferences.amenities.length} preferred amenities`
          });
        }
      }
      
      // Location explanation
      if (factorScores.location > 80) {
        if (userPreferences.location_preferences && 
            userPreferences.location_preferences.neighborhoods &&
            userPreferences.location_preferences.neighborhoods.includes(hotel.address.neighborhood)) {
          explanations.push({
            type: 'location',
            description: `Located in your preferred neighborhood (${hotel.address.neighborhood})`
          });
        } else if (hotel.address.near_public_transport) {
          explanations.push({
            type: 'location',
            description: 'Conveniently located near public transportation'
          });
        }
      }
      
      // Rating explanation
      if (factorScores.rating > 80) {
        if (hotel.user_rating >= 8.5) {
          explanations.push({
            type: 'rating',
            description: `Exceptionally well-rated (${hotel.user_rating}/10)`
          });
        } else if (hotel.user_rating >= 8.0) {
          explanations.push({
            type: 'rating',
            description: `Very well-rated (${hotel.user_rating}/10)`
          });
        }
      }
      
      // Deal explanation
      if (factorScores.deal > 80) {
        if (hotel.original_price && hotel.price < hotel.original_price) {
          const discountPercentage = Math.round(((hotel.original_price - hotel.price) / hotel.original_price) * 100);
          explanations.push({
            type: 'deal',
            description: `${discountPercentage}% cheaper than usual price`
          });
        } else {
          explanations.push({
            type: 'deal',
            description: 'Exceptional value for the quality offered'
          });
        }
      }
      
      // If no specific explanations, add a generic one
      if (explanations.length === 0) {
        explanations.push({
          type: 'general',
          description: 'Good match for budget travelers'
        });
      }
      
      return {
        ...hotel,
        recommendation_explanations: explanations
      };
    });
  }
  
  // Helper methods for MVP (would be replaced with real implementations)
  
  /**
   * Get hotels in a specific location
   * @param {String} location - Target location
   * @returns {Array} Hotels in the location
   */
  async getHotelsInLocation(location) {
    // For MVP, use mock data
    return [
      {
        hotel_id: 'hotel1',
        name: 'Urban Budget Hotel',
        thumbnail: 'https://via.placeholder.com/300x200?text=Urban+Budget+Hotel',
        address: { 
          city: location, 
          country: 'USA',
          neighborhood: 'Downtown',
          near_public_transport: true
        },
        star_rating: 3,
        user_rating: 8.5,
        amenities: ['wifi', 'breakfast', 'pool'],
        images: ['https://via.placeholder.com/800x500?text=Urban+Budget+Hotel']
      },
      {
        hotel_id: 'hotel2',
        name: 'Cozy Stay Inn',
        thumbnail: 'https://via.placeholder.com/300x200?text=Cozy+Stay+Inn',
        address: { 
          city: location, 
          country: 'USA',
          neighborhood: 'Midtown',
          near_public_transport: true
        },
        star_rating: 3,
        user_rating: 8.2,
        amenities: ['wifi', 'breakfast'],
        images: ['https://via.placeholder.com/800x500?text=Cozy+Stay+Inn']
      },
      {
        hotel_id: 'hotel3',
        name: 'Backpacker\'s Paradise',
        thumbnail: 'https://via.placeholder.com/300x200?text=Backpackers+Paradise',
        address: { 
          city: location, 
          country: 'USA',
          neighborhood: 'Downtown',
          near_public_transport: true
        },
        star_rating: 2,
        user_rating: 7.9,
        amenities: ['wifi'],
        images: ['https://via.placeholder.com/800x500?text=Backpackers+Paradise']
      },
      {
        hotel_id: 'hotel4',
        name: 'Downtown Budget Suites',
        thumbnail: 'https://via.placeholder.com/300x200?text=Downtown+Budget+Suites',
        address: { 
          city: location, 
          country: 'USA',
          neighborhood: 'Downtown',
          near_public_transport: false
        },
        star_rating: 3,
        user_rating: 8.0,
        amenities: ['wifi', 'pool'],
        images: ['https://via.placeholder.com/800x500?text=Downtown+Budget+Suites']
      },
      {
        hotel_id: 'hotel5',
        name: 'Traveler\'s Rest Hotel',
        thumbnail: 'https://via.placeholder.com/300x200?text=Travelers+Rest+Hotel',
        address: { 
          city: location, 
          country: 'USA',
          neighborhood: 'Uptown',
          near_public_transport: false
        },
        star_rating: 2,
        user_rating: 7.5,
        amenities: ['wifi', 'breakfast'],
        images: ['https://via.placeholder.com/800x500?text=Travelers+Rest+Hotel']
      }
    ];
  }
  
  /**
   * Get current price for a hotel
   * @param {String} hotelId - Hotel ID
   * @returns {Object} Current price data
   */
  async getCurrentPrice(hotelId) {
    // For MVP, use mock data
    const prices = {
      'hotel1': { price: 75, original_price: 95, currency: 'USD' },
      'hotel2': { price: 82, original_price: 110, currency: 'USD' },
      'hotel3': { price: 25, original_price: 35, currency: 'USD' },
      'hotel4': { price: 89, original_price: null, currency: 'USD' },
      'hotel5': { price: 65, original_price: 80, currency: 'USD' }
    };
    
    return prices[hotelId] || { price: 100, original_price: null, currency: 'USD' };
  }
}

module.exports = new RecommendationAgent();
