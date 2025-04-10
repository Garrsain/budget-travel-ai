/**
 * Hotel Booking API Integration
 * 
 * This module integrates with hotel booking APIs and affiliate systems
 * to provide booking functionality for the Budget Travel Platform.
 * 
 * For the MVP, we'll focus on integrating with Booking.com's affiliate program,
 * which allows us to earn commissions on bookings without handling payments directly.
 */

const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

class BookingAPIIntegration {
  constructor() {
    this.affiliateId = process.env.BOOKING_AFFILIATE_ID || 'demo-affiliate-id';
    this.apiKey = process.env.BOOKING_API_KEY || 'demo-api-key';
    this.baseUrl = 'https://distribution-xml.booking.com/json/bookings';
    this.useMockData = true;
  }

  generateBookingLink(hotelId, bookingParams = {}) {
    const {
      checkIn = new Date().toISOString().split('T')[0],
      checkOut = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      adults = 2,
      children = 0,
      rooms = 1
    } = bookingParams;

    return `https://www.booking.com/hotel/us/${hotelId}.html?aid=${this.affiliateId}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${children}&rooms=${rooms}`;
  }

  async searchHotels(searchParams) {
    try {
      if (this.useMockData) {
        return this.getMockHotelSearchResults(searchParams);
      }

      const response = await axios.get(`${this.baseUrl}/hotels`, {
        params: {
          city_ids: searchParams.cityId,
          arrival_date: searchParams.checkIn,
          departure_date: searchParams.checkOut,
          guest_qty: searchParams.guests,
          room_qty: searchParams.rooms,
          extras: 'hotel_info,room_info,hotel_photos',
          languagecode: 'en',
          affiliate_id: this.affiliateId,
          api_key: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  }

  async getHotelDetails(hotelId) {
    try {
      if (this.useMockData) {
        return this.getMockHotelDetails(hotelId);
      }

      const response = await axios.get(`${this.baseUrl}/hotels/${hotelId}`, {
        params: {
          extras: 'hotel_info,room_info,hotel_photos,hotel_facilities',
          languagecode: 'en',
          affiliate_id: this.affiliateId,
          api_key: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting hotel details:', error);
      throw error;
    }
  }

  async getHotelPrices(hotelId, bookingParams) {
    try {
      if (this.useMockData) {
        return this.getMockHotelPrices(hotelId, bookingParams);
      }

      const response = await axios.get(`${this.baseUrl}/hotels/${hotelId}/price`, {
        params: {
          arrival_date: bookingParams.checkIn,
          departure_date: bookingParams.checkOut,
          guest_qty: bookingParams.guests,
          room_qty: bookingParams.rooms,
          languagecode: 'en',
          affiliate_id: this.affiliateId,
          api_key: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting hotel prices:', error);
      throw error;
    }
  }

  async trackBookingConversion(hotelId, bookingData) {
    try {
      console.log(`Booking conversion tracked for hotel ${hotelId}:`, bookingData);
      return {
        success: true,
        message: 'Booking conversion tracked successfully'
      };
    } catch (error) {
      console.error('Error tracking booking conversion:', error);
      throw error;
    }
  }

  getMockHotelSearchResults(searchParams) {
    return {
      result: 'success',
      hotels: [
        {
          hotel_id: 'urban-budget-hotel',
          name: 'Urban Budget Hotel',
          address: {
            city: searchParams.location || 'New York',
            country: 'USA'
          },
          star_rating: 3,
          review_score: 8.5,
          review_count: 245,
          price: 75,
          currency: 'USD',
          photos: [
            'https://via.placeholder.com/800x500?text=Urban+Budget+Hotel'
          ],
          url: this.generateBookingLink('urban-budget-hotel')
        },
        {
          hotel_id: 'cozy-stay-inn',
          name: 'Cozy Stay Inn',
          address: {
            city: searchParams.location || 'New York',
            country: 'USA'
          },
          star_rating: 3,
          review_score: 8.2,
          review_count: 187,
          price: 82,
          currency: 'USD',
          photos: [
            'https://via.placeholder.com/800x500?text=Cozy+Stay+Inn'
          ],
          url: this.generateBookingLink('cozy-stay-inn')
        },
        {
          hotel_id: 'backpackers-paradise',
          name: "Backpacker's Paradise",
          address: {
            city: searchParams.location || 'New York',
            country: 'USA'
          },
          star_rating: 2,
          review_score: 7.9,
          review_count: 320,
          price: 25,
          currency: 'USD',
          photos: [
            'https://via.placeholder.com/800x500?text=Backpackers+Paradise'
          ],
          url: this.generateBookingLink('backpackers-paradise')
        }
      ]
    };
  }

  getMockHotelDetails(hotelId) {
    const hotelDetails = {
      'urban-budget-hotel': {
        hotel_id: 'urban-budget-hotel',
        name: 'Urban Budget Hotel',
        description: "Urban Budget Hotel offers comfortable accommodations in the heart of New York City. This charming property features simple but well-appointed rooms, perfect for travelers looking to explore the city on a budget.",
        address: {
          street: '123 Budget Street',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zip: '10001',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.0060
          }
        },
        star_rating: 3,
        review_score: 8.5,
        review_count: 245,
        facilities: [
          'Free WiFi',
          'Breakfast included',
          'Air conditioning',
          '24-hour reception',
          'Non-smoking rooms',
          'Elevator',
          'Luggage storage',
          'Daily housekeeping'
        ],
        photos: [
          'https://via.placeholder.com/800x500?text=Urban+Budget+Hotel+1',
          'https://via.placeholder.com/800x500?text=Urban+Budget+Hotel+2',
          'https://via.placeholder.com/800x500?text=Urban+Budget+Hotel+3'
        ],
        url: this.generateBookingLink('urban-budget-hotel')
      },
      'cozy-stay-inn': {
        hotel_id: 'cozy-stay-inn',
        name: 'Cozy Stay Inn',
        description: "Cozy Stay Inn provides a warm and welcoming atmosphere for budget travelers in New York City. With its convenient location and comfortable rooms, it's a perfect choice for those looking to explore the city without breaking the bank.",
        address: {
          street: '456 Comfort Avenue',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zip: '10002',
          coordinates: {
            latitude: 40.7282,
            longitude: -73.9942
          }
        },
        star_rating: 3,
        review_score: 8.2,
        review_count: 187,
        facilities: [
          'Free WiFi',
          'Breakfast included',
          'Air conditioning',
          '24-hour reception',
          'Non-smoking rooms',
          'Elevator'
        ],
        photos: [
          'https://via.placeholder.com/800x500?text=Cozy+Stay+Inn+1',
          'https://via.placeholder.com/800x500?text=Cozy+Stay+Inn+2'
        ],
        url: this.generateBookingLink('cozy-stay-inn')
      }
    };

    return hotelDetails[hotelId] || {
      error: 'Hotel not found'
    };
  }

  getMockHotelPrices(hotelId, bookingParams) {
    const basePrices = {
      'urban-budget-hotel': 75,
      'cozy-stay-inn': 82,
      'backpackers-paradise': 25
    };

    const basePrice = basePrices[hotelId] || 100;

    const checkIn = new Date(bookingParams.checkIn || new Date());
    const checkOut = new Date(bookingParams.checkOut || new Date(Date.now() + 86400000 * 3));
    const nights = Math.max(1, Math.ceil((checkOut - checkIn) / 86400000));

    const totalPrice = basePrice * nights;

    return {
      hotel_id: hotelId,
      currency: 'USD',
      base_price: basePrice,
      total_price: totalPrice,
      nights: nights,
      price_breakdown: {
        per_night: basePrice,
        taxes_and_fees: Math.round(totalPrice * 0.15),
        total_including_taxes: Math.round(totalPrice * 1.15)
      },
      available: true,
      booking_url: this.generateBookingLink(hotelId, bookingParams)
    };
  }
}

module.exports = new BookingAPIIntegration();
