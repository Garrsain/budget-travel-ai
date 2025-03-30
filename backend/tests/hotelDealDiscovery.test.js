const hotelDealDiscoveryAgent = require('../src/ai_agents/hotelDealDiscovery.agent');

describe('Hotel Deal Discovery Agent', () => {
  describe('calculateHistoricalComparisonScore', () => {
    it('should return neutral score if no historical data', () => {
      const currentPrice = { price: 100 };
      const historicalPrices = [];
      
      const score = hotelDealDiscoveryAgent.calculateHistoricalComparisonScore(currentPrice, historicalPrices);
      expect(score).toEqual(50);
    });
    
    it('should return high score if current price is lower than historical average', () => {
      const currentPrice = { price: 70 };
      const historicalPrices = [
        { price: 100 },
        { price: 110 },
        { price: 90 }
      ];
      
      const score = hotelDealDiscoveryAgent.calculateHistoricalComparisonScore(currentPrice, historicalPrices);
      expect(score).toBeGreaterThan(50);
    });
    
    it('should return low score if current price is higher than historical average', () => {
      const currentPrice = { price: 120 };
      const historicalPrices = [
        { price: 100 },
        { price: 110 },
        { price: 90 }
      ];
      
      const score = hotelDealDiscoveryAgent.calculateHistoricalComparisonScore(currentPrice, historicalPrices);
      expect(score).toBeLessThan(50);
    });
  });
  
  describe('calculateValueAssessmentScore', () => {
    it('should return higher score for better price-to-quality ratio', () => {
      const hotel1 = { star_rating: 3, user_rating: 8.5 };
      const hotel2 = { star_rating: 3, user_rating: 7.5 };
      const price = { price: 100 };
      
      const score1 = hotelDealDiscoveryAgent.calculateValueAssessmentScore(hotel1, price);
      const score2 = hotelDealDiscoveryAgent.calculateValueAssessmentScore(hotel2, price);
      
      expect(score1).toBeGreaterThan(score2);
    });
    
    it('should return higher score for lower price with same quality', () => {
      const hotel = { star_rating: 3, user_rating: 8.0 };
      const price1 = { price: 80 };
      const price2 = { price: 120 };
      
      const score1 = hotelDealDiscoveryAgent.calculateValueAssessmentScore(hotel, price1);
      const score2 = hotelDealDiscoveryAgent.calculateValueAssessmentScore(hotel, price2);
      
      expect(score1).toBeGreaterThan(score2);
    });
  });
  
  describe('generateDealInsights', () => {
    it('should not generate insights for poor deals', () => {
      const hotel = { star_rating: 3, user_rating: 7.0 };
      const currentPrice = { price: 100 };
      const historicalPrices = [{ price: 90 }, { price: 95 }];
      const scores = {
        historicalComparisonScore: 40,
        valueAssessmentScore: 50,
        seasonalFactorScore: 45,
        dealScore: 45
      };
      
      const insights = hotelDealDiscoveryAgent.generateDealInsights(hotel, currentPrice, historicalPrices, scores);
      expect(insights.length).toEqual(0);
    });
    
    it('should generate historical price insight for good historical comparison', () => {
      const hotel = { star_rating: 3, user_rating: 8.0 };
      const currentPrice = { price: 70 };
      const historicalPrices = [{ price: 100 }, { price: 110 }];
      const scores = {
        historicalComparisonScore: 80,
        valueAssessmentScore: 60,
        seasonalFactorScore: 50,
        dealScore: 65
      };
      
      const insights = hotelDealDiscoveryAgent.generateDealInsights(hotel, currentPrice, historicalPrices, scores);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(insight => insight.insight_type === 'price_drop')).toBeTruthy();
    });
    
    it('should generate value insight for good value assessment', () => {
      const hotel = { star_rating: 4, user_rating: 8.5 };
      const currentPrice = { price: 90 };
      const historicalPrices = [{ price: 100 }];
      const scores = {
        historicalComparisonScore: 60,
        valueAssessmentScore: 85,
        seasonalFactorScore: 50,
        dealScore: 65
      };
      
      const insights = hotelDealDiscoveryAgent.generateDealInsights(hotel, currentPrice, historicalPrices, scores);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(insight => insight.insight_type === 'good_value')).toBeTruthy();
    });
  });
  
  describe('findBestDeals', () => {
    it('should return deals sorted by deal score', async () => {
      const deals = await hotelDealDiscoveryAgent.findBestDeals('New York');
      
      // Check if deals are sorted by deal_score (descending)
      for (let i = 0; i < deals.length - 1; i++) {
        expect(deals[i].deal_score).toBeGreaterThanOrEqual(deals[i + 1].deal_score);
      }
    });
    
    it('should filter deals by minimum deal score', async () => {
      const minDealScore = 80;
      const deals = await hotelDealDiscoveryAgent.findBestDeals('New York', { minDealScore });
      
      // Check if all deals meet minimum deal score
      deals.forEach(deal => {
        expect(deal.deal_score).toBeGreaterThanOrEqual(minDealScore);
      });
    });
  });
});
