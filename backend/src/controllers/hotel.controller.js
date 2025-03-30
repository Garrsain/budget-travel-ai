/**
 * Hotel Controller
 * 
 * Handles hotel-related API endpoints
 */

const hotelDealDiscoveryAgent = require('../ai_agents/hotelDealDiscovery.agent');

// Controller methods
exports.getHotelDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkin, checkout, guests } = req.query;
    
    // Validate required parameters
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Hotel ID is required'
      });
    }
    
    // For MVP, use mock data
    // In a real implementation, this would query the database
    
    // Get hotel data (mock)
    const hotel = getMockHotelDetails(id);
    
    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }
    
    // Get deal insights for this hotel
    const dealInsights = await hotelDealDiscoveryAgent.generateHotelDealInsights(id);
    
    // Return results
    res.status(200).json({
      status: 'success',
      hotel: {
        ...hotel,
        deal_insights: dealInsights.map(insight => ({
          type: insight.insight_type,
          description: insight.description
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get mock hotel details
function getMockHotelDetails(hotelId) {
  // Mock hotel details
  const hotels = {
    'hotel1': {
      hotel_id: 'hotel1',
      name: 'Urban Budget Hotel',
      description: "Urban Budget Hotel offers comfortable accommodations in the heart of New York City. This charming property features simple but well-appointed rooms, perfect for travelers looking to explore the city on a budget. Located just a short walk from major attractions and public transportation, it provides an ideal base for your city adventure.",
      address: {
        street: '123 Budget Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10001',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      },
      star_rating: 3,
      user_rating: 8.5,
      review_count: 245,
      images: [
        'https://via.placeholder.com/800x500?text=Urban+Budget+Hotel+1',
        'https://via.placeholder.com/800x500?text=Urban+Budget+Hotel+2',
        'https://via.placeholder.com/800x500?text=Urban+Budget+Hotel+3',
        'https://via.placeholder.com/800x500?text=Urban+Budget+Hotel+4'
      ],
      price: 75,
      original_price: 95,
      currency: 'USD',
      deal_score: 85,
      amenities: [
        'Free WiFi',
        'Breakfast included',
        'Air conditioning',
        '24-hour reception',
        'Non-smoking rooms',
        'Elevator',
        'Luggage storage',
        'Daily housekeeping'
      ],
      location_highlights: [
        '1.2km from city center',
        '350m to nearest metro station',
        '18km from JFK Airport',
        'Walking distance to restaurants and shops'
      ],
      booking_url: 'https://booking.com/affiliate-link',
      similar_hotels: [
        {
          hotel_id: 'hotel2',
          name: 'Cozy Stay Inn',
          thumbnail: 'https://via.placeholder.com/300x200?text=Cozy+Stay+Inn',
          price: 82,
          currency: 'USD',
          user_rating: 8.2
        },
        {
          hotel_id: 'hotel3',
          name: "Backpacker's Paradise",
          thumbnail: 'https://via.placeholder.com/300x200?text=Backpackers+Paradise',
          price: 25,
          currency: 'USD',
          user_rating: 7.9
        },
        {
          hotel_id: 'hotel4',
          name: 'Downtown Budget Suites',
          thumbnail: 'https://via.placeholder.com/300x200?text=Downtown+Budget+Suites',
          price: 89,
          currency: 'USD',
          user_rating: 8.0
        }
      ]
    },
    'hotel2': {
      hotel_id: 'hotel2',
      name: 'Cozy Stay Inn',
      description: "Cozy Stay Inn provides a warm and welcoming atmosphere for budget travelers in New York City. With its convenient location and comfortable rooms, it's a perfect choice for those looking to explore the city without breaking the bank. The friendly staff and clean facilities ensure a pleasant stay for all guests.",
      address: {
        street: '456 Comfort Avenue',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10002',
        coordinates: {
          latitude: 40.7282,
          longitude: -73.9942
        }
      },
      star_rating: 3,
      user_rating: 8.2,
      review_count: 187,
      images: [
        'https://via.placeholder.com/800x500?text=Cozy+Stay+Inn+1',
        'https://via.placeholder.com/800x500?text=Cozy+Stay+Inn+2',
        'https://via.placeholder.com/800x500?text=Cozy+Stay+Inn+3'
      ],
      price: 82,
      original_price: 110,
      currency: 'USD',
      deal_score: 80,
      amenities: [
        'Free WiFi',
        'Breakfast included',
        'Air conditioning',
        '24-hour reception',
        'Non-smoking rooms',
        'Elevator'
      ],
      location_highlights: [
        '0.8km from city center',
        '200m to nearest metro station',
        '20km from JFK Airport',
        'Near shopping district'
      ],
      booking_url: 'https://booking.com/affiliate-link',
      similar_hotels: [
        {
          hotel_id: 'hotel1',
          name: 'Urban Budget Hotel',
          thumbnail: 'https://via.placeholder.com/300x200?text=Urban+Budget+Hotel',
          price: 75,
          currency: 'USD',
          user_rating: 8.5
        },
        {
          hotel_id: 'hotel4',
          name: 'Downtown Budget Suites',
          thumbnail: 'https://via.placeholder.com/300x200?text=Downtown+Budget+Suites',
          price: 89,
          currency: 'USD',
          user_rating: 8.0
        },
        {
          hotel_id: 'hotel5',
          name: "Traveler's Rest Hotel",
          thumbnail: 'https://via.placeholder.com/300x200?text=Travelers+Rest+Hotel',
          price: 65,
          currency: 'USD',
          user_rating: 7.5
        }
      ]
    }
  };
  
  return hotels[hotelId];
}
