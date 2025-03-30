const recommendationAgent = require('../src/ai_agents/recommendation.agent');

describe('Recommendation Agent', () => {
  describe('calculateBudgetScore', () => {
    it('should return neutral score if no budget specified', () => {
      const price = 100;
      const budget = undefined;
      
      const score = recommendationAgent.calculateBudgetScore(price, budget);
      expect(score).toEqual(50);
    });
    
    it('should return high score if price is well below budget', () => {
      const price = 70;
      const budget = 100;
      
      const score = recommendationAgent.calculateBudgetScore(price, budget);
      expect(score).toBeGreaterThan(70);
    });
    
    it('should return moderate score if price is at budget', () => {
      const price = 100;
      const budget = 100;
      
      const score = recommendationAgent.calculateBudgetScore(price, budget);
      expect(score).toEqual(70);
    });
    
    it('should return low score if price is above budget', () => {
      const price = 120;
      const budget = 100;
      
      const score = recommendationAgent.calculateBudgetScore(price, budget);
      expect(score).toBeLessThan(70);
    });
  });
  
  describe('calculateAmenityScore', () => {
    it('should return neutral score if no preferred amenities', () => {
      const hotelAmenities = ['wifi', 'breakfast', 'pool'];
      const preferredAmenities = undefined;
      
      const score = recommendationAgent.calculateAmenityScore(hotelAmenities, preferredAmenities);
      expect(score).toEqual(50);
    });
    
    it('should return 100 if all preferred amenities are available', () => {
      const hotelAmenities = ['wifi', 'breakfast', 'pool', 'gym'];
      const preferredAmenities = ['wifi', 'breakfast'];
      
      const score = recommendationAgent.calculateAmenityScore(hotelAmenities, preferredAmenities);
      expect(score).toEqual(100);
    });
    
    it('should return partial score if some preferred amenities are available', () => {
      const hotelAmenities = ['wifi', 'pool'];
      const preferredAmenities = ['wifi', 'breakfast', 'gym'];
      
      const score = recommendationAgent.calculateAmenityScore(hotelAmenities, preferredAmenities);
      expect(score).toEqual(33);
    });
    
    it('should return 0 if no preferred amenities are available', () => {
      const hotelAmenities = ['pool', 'gym'];
      const preferredAmenities = ['wifi', 'breakfast'];
      
      const score = recommendationAgent.calculateAmenityScore(hotelAmenities, preferredAmenities);
      expect(score).toEqual(0);
    });
  });
  
  describe('generateRecommendationExplanations', () => {
    it('should generate budget explanation for good budget score', () => {
      const hotel = {
        hotel_id: 'hotel1',
        name: 'Test Hotel',
        price: 70,
        factor_scores: {
          budget: 85,
          amenities: 50,
          location: 50,
          rating: 50,
          deal: 50
        }
      };
      
      const userPreferences = {
        budget: 100
      };
      
      const result = recommendationAgent.generateRecommendationExplanations([hotel], userPreferences);
      expect(result[0].recommendation_explanations.some(exp => exp.type === 'budget')).toBeTruthy();
    });
    
    it('should generate amenity explanation for good amenity score', () => {
      const hotel = {
        hotel_id: 'hotel1',
        name: 'Test Hotel',
        amenities: ['wifi', 'breakfast'],
        factor_scores: {
          budget: 50,
          amenities: 85,
          location: 50,
          rating: 50,
          deal: 50
        }
      };
      
      const userPreferences = {
        amenities: ['wifi', 'breakfast']
      };
      
      const result = recommendationAgent.generateRecommendationExplanations([hotel], userPreferences);
      expect(result[0].recommendation_explanations.some(exp => exp.type === 'amenities')).toBeTruthy();
    });
    
    it('should generate rating explanation for good rating score', () => {
      const hotel = {
        hotel_id: 'hotel1',
        name: 'Test Hotel',
        user_rating: 8.7,
        factor_scores: {
          budget: 50,
          amenities: 50,
          location: 50,
          rating: 85,
          deal: 50
        }
      };
      
      const userPreferences = {};
      
      const result = recommendationAgent.generateRecommendationExplanations([hotel], userPreferences);
      expect(result[0].recommendation_explanations.some(exp => exp.type === 'rating')).toBeTruthy();
    });
    
    it('should generate deal explanation for good deal score', () => {
      const hotel = {
        hotel_id: 'hotel1',
        name: 'Test Hotel',
        price: 80,
        original_price: 100,
        factor_scores: {
          budget: 50,
          amenities: 50,
          location: 50,
          rating: 50,
          deal: 85
        }
      };
      
      const userPreferences = {};
      
      const result = recommendationAgent.generateRecommendationExplanations([hotel], userPreferences);
      expect(result[0].recommendation_explanations.some(exp => exp.type === 'deal')).toBeTruthy();
    });
    
    it('should generate generic explanation if no high scores', () => {
      const hotel = {
        hotel_id: 'hotel1',
        name: 'Test Hotel',
        factor_scores: {
          budget: 50,
          amenities: 50,
          location: 50,
          rating: 50,
          deal: 50
        }
      };
      
      const userPreferences = {};
      
      const result = recommendationAgent.generateRecommendationExplanations([hotel], userPreferences);
      expect(result[0].recommendation_explanations.some(exp => exp.type === 'general')).toBeTruthy();
    });
  });
  
  describe('getPersonalizedRecommendations', () => {
    it('should return recommendations sorted by recommendation score', async () => {
      const userPreferences = {
        budget: 100,
        amenities: ['wifi']
      };
      
      const recommendations = await recommendationAgent.getPersonalizedRecommendations(
        userPreferences,
        'New York'
      );
      
      // Check if recommendations are sorted by recommendation_score (descending)
      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].recommendation_score).toBeGreaterThanOrEqual(
          recommendations[i + 1].recommendation_score
        );
      }
    });
    
    it('should filter recommendations by filters', async () => {
      const userPreferences = {
        budget: 100,
        amenities: ['wifi']
      };
      
      const filters = {
        maxPrice: 80,
        minRecommendationScore: 60
      };
      
      const recommendations = await recommendationAgent.getPersonalizedRecommendations(
        userPreferences,
        'New York',
        filters
      );
      
      // Check if all recommendations meet filter criteria
      recommendations.forEach(rec => {
        expect(rec.price).toBeLessThanOrEqual(filters.maxPrice);
        expect(rec.recommendation_score).toBeGreaterThanOrEqual(filters.minRecommendationScore);
      });
    });
  });
});
