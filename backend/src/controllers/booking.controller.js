/**
 * Booking Controller
 * 
 * Handles booking-related API endpoints
 */

const bookingIntegration = require('../integrations/booking.integration');

// Controller methods
exports.generateBookingLink = async (req, res, next) => {
  try {
    const { hotel_id } = req.params;
    const { checkin, checkout, adults, children, rooms } = req.query;
    
    // Validate required parameters
    if (!hotel_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Hotel ID is required'
      });
    }
    
    // Create booking parameters object
    const bookingParams = {
      checkIn: checkin,
      checkOut: checkout,
      adults: adults ? parseInt(adults) : 2,
      children: children ? parseInt(children) : 0,
      rooms: rooms ? parseInt(rooms) : 1
    };
    
    // Generate booking link
    const bookingLink = bookingIntegration.generateBookingLink(hotel_id, bookingParams);
    
    // Return results
    res.status(200).json({
      status: 'success',
      booking_link: bookingLink
    });
  } catch (error) {
    next(error);
  }
};

exports.getHotelPrices = async (req, res, next) => {
  try {
    const { hotel_id } = req.params;
    const { checkin, checkout, adults, children, rooms } = req.query;
    
    // Validate required parameters
    if (!hotel_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Hotel ID is required'
      });
    }
    
    if (!checkin || !checkout) {
      return res.status(400).json({
        status: 'error',
        message: 'Check-in and check-out dates are required'
      });
    }
    
    // Create booking parameters object
    const bookingParams = {
      checkIn: checkin,
      checkOut: checkout,
      adults: adults ? parseInt(adults) : 2,
      children: children ? parseInt(children) : 0,
      rooms: rooms ? parseInt(rooms) : 1
    };
    
    // Get hotel prices
    const priceData = await bookingIntegration.getHotelPrices(hotel_id, bookingParams);
    
    // Return results
    res.status(200).json({
      status: 'success',
      price_data: priceData
    });
  } catch (error) {
    next(error);
  }
};

exports.trackBookingConversion = async (req, res, next) => {
  try {
    const { hotel_id } = req.params;
    const bookingData = req.body;
    
    // Validate required parameters
    if (!hotel_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Hotel ID is required'
      });
    }
    
    // Track booking conversion
    const result = await bookingIntegration.trackBookingConversion(hotel_id, bookingData);
    
    // Return results
    res.status(200).json({
      status: 'success',
      result
    });
  } catch (error) {
    next(error);
  }
};
