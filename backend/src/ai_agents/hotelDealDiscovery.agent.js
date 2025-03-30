/**
 * Hotel Deal Discovery AI Agent
 * 
 * This agent analyzes hotel prices and identifies exceptional deals for budget travelers.
 * It uses various factors to calculate a "deal score" for each hotel:
 * 1. Historical price comparison
 * 2. Value assessment (price-to-quality ratio)
 * 3. Seasonal pricing trends
 * 
 * The agent generates human-readable explanations for why a particular hotel
 * represents a good deal for budget travelers.
 */

const axios = require('axios');
const Hotel = require('../models/hotel.model');
const Price = require('../models/price.model');
const DealInsight = require('../models/dealInsight.model');

class HotelDealDiscoveryAgent {
  /**
   * Analyze a hotel's current price and generate a deal score
   * @param {Object} hotel - Hotel data
   * @param {Object} priceData - Current price data
   * @param {Object} historicalPrices - Historical price data
   * @returns {Object} Deal analysis with score and factors
   */
  async analyzeDeal(hotel, priceData, historicalPrices) {
    // Calculate individual factor scores
    const historicalComparisonScore = this.calculateHistoricalComparisonScore(priceData, historicalPrices);
    const valueAssessmentScore = this.calculateValueAssessmentScore(hotel, priceData);
    const seasonalFactorScore = this.calculateSeasonalFactorScore(priceData, historicalPrices);
    
    // Calculate overall deal score (weighted average)
    const dealScore = Math.round(
      (historicalComparisonScore * 0.5) + 
      (valueAssessmentScore * 0.3) + 
      (seasonalFactorScore * 0.2)
    );
    
    // Generate deal insights
    const dealInsights = this.generateDealInsights(
      hotel, 
      priceData, 
      historicalPrices, 
      {
        historicalComparisonScore,
        valueAssessmentScore,
        seasonalFactorScore,
        dealScore
      }
    );
    
    return {
      dealScore,
      dealFactors: {
        historicalComparison: historicalComparisonScore,
        valueAssessment: valueAssessmentScore,
        seasonalFactor: seasonalFactorScore
      },
      dealInsights
    };
  }
  
  /**
   * Calculate score based on comparison with historical prices
   * @param {Object} currentPrice - Current price data
   * @param {Array} historicalPrices - Historical price data
   * @returns {Number} Score from 0-100
   */
  calculateHistoricalComparisonScore(currentPrice, historicalPrices) {
    if (!historicalPrices || historicalPrices.length === 0) {
      return 50; // Neutral score if no historical data
    }
    
    // Calculate average historical price
    const avgHistoricalPrice = historicalPrices.reduce((sum, price) => sum + price.price, 0) / historicalPrices.length;
    
    // Calculate percentage difference
    const priceDifference = (avgHistoricalPrice - currentPrice.price) / avgHistoricalPrice;
    
    // Convert to score (0-100)
    // If current price is 30% or more below average, score 100
    // If current price is 30% or more above average, score 0
    let score = 50 + (priceDifference * 167); // 50 + (% diff * scaling factor)
    
    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate score based on price-to-quality ratio
   * @param {Object} hotel - Hotel data
   * @param {Object} priceData - Current price data
   * @returns {Number} Score from 0-100
   */
  calculateValueAssessmentScore(hotel, priceData) {
    // Basic value assessment based on star rating and user rating
    const qualityScore = (hotel.star_rating * 10) + (hotel.user_rating * 5);
    
    // Calculate value ratio (quality per dollar)
    const valueRatio = qualityScore / priceData.price;
    
    // Convert to score (0-100)
    // Scale based on typical value ratios for budget hotels
    // Higher valueRatio = better deal
    let score = valueRatio * 200; // Scaling factor
    
    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate score based on seasonal pricing trends
   * @param {Object} currentPrice - Current price data
   * @param {Array} historicalPrices - Historical price data
   * @returns {Number} Score from 0-100
   */
  calculateSeasonalFactorScore(currentPrice, historicalPrices) {
    if (!historicalPrices || historicalPrices.length === 0) {
      return 50; // Neutral score if no historical data
    }
    
    // Get current month
    const currentMonth = new Date(currentPrice.date_from).getMonth();
    
    // Filter historical prices for the same month
    const sameMonthPrices = historicalPrices.filter(price => 
      new Date(price.date_from).getMonth() === currentMonth
    );
    
    if (sameMonthPrices.length === 0) {
      return 50; // Neutral score if no seasonal data
    }
    
    // Calculate average price for this season
    const avgSeasonalPrice = sameMonthPrices.reduce((sum, price) => sum + price.price, 0) / sameMonthPrices.length;
    
    // Calculate percentage difference
    const seasonalDifference = (avgSeasonalPrice - currentPrice.price) / avgSeasonalPrice;
    
    // Convert to score (0-100)
    let score = 50 + (seasonalDifference * 167); // 50 + (% diff * scaling factor)
    
    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Generate human-readable insights about the deal
   * @param {Object} hotel - Hotel data
   * @param {Object} priceData - Current price data
   * @param {Array} historicalPrices - Historical price data
   * @param {Object} scores - Various calculated scores
   * @returns {Array} Array of insight objects
   */
  generateDealInsights(hotel, priceData, historicalPrices, scores) {
    const insights = [];
    
    // Only generate insights for good deals (score > 60)
    if (scores.dealScore <= 60) {
      return insights;
    }
    
    // Historical price comparison insight
    if (scores.historicalComparisonScore > 70) {
      const avgHistoricalPrice = historicalPrices.reduce((sum, price) => sum + price.price, 0) / historicalPrices.length;
      const priceDifference = Math.round(((avgHistoricalPrice - priceData.price) / avgHistoricalPrice) * 100);
      
      insights.push({
        insight_type: 'price_drop',
        description: `${priceDifference}% cheaper than typical prices for this hotel`,
        confidence_score: scores.historicalComparisonScore
      });
    }
    
    // Value assessment insight
    if (scores.valueAssessmentScore > 70) {
      let valueInsight;
      
      if (hotel.star_rating >= 4 && priceData.price < 100) {
        valueInsight = `Great value: ${hotel.star_rating}-star amenities at budget prices`;
      } else if (hotel.user_rating > 8 && priceData.price < 80) {
        valueInsight = `Highly rated (${hotel.user_rating}/10) at a budget-friendly price`;
      } else {
        valueInsight = `Better amenities than most hotels at this price point`;
      }
      
      insights.push({
        insight_type: 'good_value',
        description: valueInsight,
        confidence_score: scores.valueAssessmentScore
      });
    }
    
    // Seasonal factor insight
    if (scores.seasonalFactorScore > 70) {
      const currentMonth = new Date(priceData.date_from).getMonth();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      insights.push({
        insight_type: 'seasonal_deal',
        description: `Exceptional price for ${monthNames[currentMonth]} (typically a more expensive time)`,
        confidence_score: scores.seasonalFactorScore
      });
    }
    
    // If there's a significant discount from original price
    if (priceData.original_price && priceData.price < priceData.original_price) {
      const discountPercentage = Math.round(((priceData.original_price - priceData.price) / priceData.original_price) * 100);
      
      if (discountPercentage >= 15) {
        insights.push({
          insight_type: 'price_drop',
          description: `Price dropped ${discountPercentage}% recently`,
          confidence_score: 90
        });
      }
    }
    
    return insights;
  }
  
  /**
   * Find the best hotel deals for a given location
   * @param {String} location - Location to search for
   * @param {Object} filters - Search filters
   * @returns {Array} Array of hotels with deal scores and insights
   */
  async findBestDeals(location, filters = {}) {
    try {
      // In a real implementation, this would query the database
      // For MVP, we'll use mock data
      
      // Mock implementation
      const hotels = await this.getMockHotels(location);
      const dealsWithScores = [];
      
      for (const hotel of hotels) {
        // Get current price (mock)
        const currentPrice = this.getMockCurrentPrice(hotel.hotel_id);
        
        // Get historical prices (mock)
        const historicalPrices = this.getMockHistoricalPrices(hotel.hotel_id);
        
        // Analyze deal
        const dealAnalysis = await this.analyzeDeal(hotel, currentPrice, historicalPrices);
        
        // Add to results if it meets minimum deal score
        if (dealAnalysis.dealScore >= (filters.minDealScore || 0)) {
          dealsWithScores.push({
            ...hotel,
            price: currentPrice.price,
            original_price: currentPrice.original_price,
            currency: currentPrice.currency,
            deal_score: dealAnalysis.dealScore,
            deal_summary: dealAnalysis.dealInsights.length > 0 
              ? dealAnalysis.dealInsights[0].description 
              : null
          });
        }
      }
      
      // Sort by deal score (descending)
      dealsWithScores.sort((a, b) => b.deal_score - a.deal_score);
      
      return dealsWithScores;
    } catch (error) {
      console.error('Error finding best deals:', error);
      throw error;
    }
  }
  
  /**
   * Generate deal insights for a specific hotel
   * @param {String} hotelId - Hotel ID
   * @returns {Array} Array of deal insights
   */
  async generateHotelDealInsights(hotelId) {
    try {
      // In a real implementation, this would query the database
      // For MVP, we'll use mock data
      
      // Get hotel data (mock)
      const hotel = this.getMockHotel(hotelId);
      
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      
      // Get current price (mock)
      const currentPrice = this.getMockCurrentPrice(hotelId);
      
      // Get historical prices (mock)
      const historicalPrices = this.getMockHistoricalPrices(hotelId);
      
      // Analyze deal
      const dealAnalysis = await this.analyzeDeal(hotel, currentPrice, historicalPrices);
      
      // Return insights
      return dealAnalysis.dealInsights.map(insight => ({
        ...insight,
        hotel_id: hotelId,
        hotel_name: hotel.name,
        thumbnail: hotel.thumbnail || hotel.images[0]
      }));
    } catch (error) {
      console.error('Error generating hotel deal insights:', error);
      throw error;
    }
  }
  
  // Mock data methods for MVP
  getMockHotels(location) {
    // Mock implementation returning sample hotels
    return [
      {
        hotel_id: 'hotel1',
        name: 'Urban Budget Hotel',
        thumbnail: 'https://via.placeholder.com/300x200?text=Urban+Budget+Hotel',
        address: { city: location, country: 'USA' },
        star_rating: 3,
        user_rating: 8.5,
        amenities: ['wifi', 'breakfast', 'pool'],
        images: ['https://via.placeholder.com/800x500?text=Urban+Budget+Hotel']
      },
      {
        hotel_id: 'hotel2',
        name: 'Cozy Stay Inn',
        thumbnail: 'https://via.placeholder.com/300x200?text=Cozy+Stay+Inn',
        address: { city: location, country: 'USA' },
        star_rating: 3,
        user_rating: 8.2,
        amenities: ['wifi', 'breakfast'],
        images: ['https://via.placeholder.com/800x500?text=Cozy+Stay+Inn']
      },
      {
        hotel_id: 'hotel3',
        name: 'Backpacker\'s Paradise',
        thumbnail: 'https://via.placeholder.com/300x200?text=Backpackers+Paradise',
        address: { city: location, country: 'USA' },
        star_rating: 2,
        user_rating: 7.9,
        amenities: ['wifi'],
        images: ['https://via.placeholder.com/800x500?text=Backpackers+Paradise']
      },
      {
        hotel_id: 'hotel4',
        name: 'Downtown Budget Suites',
        thumbnail: 'https://via.placeholder.com/300x200?text=Downtown+Budget+Suites',
        address: { city: location, country: 'USA' },
        star_rating: 3,
        user_rating: 8.0,
        amenities: ['wifi', 'pool'],
        images: ['https://via.placeholder.com/800x500?text=Downtown+Budget+Suites']
      },
      {
        hotel_id: 'hotel5',
        name: 'Traveler\'s Rest Hotel',
        thumbnail: 'https://via.placeholder.com/300x200?text=Travelers+Rest+Hotel',
        address: { city: location, country: 'USA' },
        star_rating: 2,
        user_rating: 7.5,
        amenities: ['wifi', 'breakfast'],
        images: ['https://via.placeholder.com/800x500?text=Travelers+Rest+Hotel']
      }
    ];
  }
  
  getMockHotel(hotelId) {
    // Mock implementation returning a specific hotel
    const allHotels = this.getMockHotels('New York');
    return allHotels.find(hotel => hotel.hotel_id === hotelId);
  }
  
  getMockCurrentPrice(hotelId) {
    // Mock implementation returning current price
    const prices = {
      'hotel1': { price: 75, original_price: 95, currency: 'USD', date_from: new Date(), date_to: new Date(Date.now() + 86400000 * 5) },
      'hotel2': { price: 82, original_price: 110, currency: 'USD', date_from: new Date(), date_to: new Date(Date.now() + 86400000 * 5) },
      'hotel3': { price: 25, original_price: 35, currency: 'USD', date_from: new Date(), date_to: new Date(Date.now() + 86400000 * 5) },
      'hotel4': { price: 89, original_price: null, currency: 'USD', date_from: new Date(), date_to: new Date(Date.now() + 86400000 * 5) },
      'hotel5': { price: 65, original_price: 80, currency: 'USD', date_from: new Date(), date_to: new Date(Date.now() + 86400000 * 5) }
    };
    
    return prices[hotelId] || { price: 100, original_price: null, currency: 'USD', date_from: new Date(), date_to: new Date(Date.now() + 86400000 * 5) };
  }
  
  getMockHistoricalPrices(hotelId) {
    // Mock implementation returning historical prices
    const now = Date.now();
    const day = 86400000; // 1 day in milliseconds
    
    // Generate 30 days of historical prices with some variation
    const historicalPrices = [];
    
    const basePrice = {
      'hotel1': 95,
      'hotel2': 105,
      'hotel3': 35,
      'hotel4': 95,
      'hotel5': 75
    }[hotelId] || 100;
    
    for (let i = 1; i <= 30; i++) {
      // Add some random variation to prices
      const variation = Math.random() * 20 - 10; // -10 to +10
      const price = Math.max(basePrice + variation, basePrice * 0.7); // Don't go below 70% of base price
      
      historicalPrices.push({
        price: Math.round(price),
        date_from: new Date(now - (day * i)),
        date_to: new Date(now - (day * i) + (day * 5))
      });
    }
    
    return historicalPrices;
  }
}

module.exports = new HotelDealDiscoveryAgent();
