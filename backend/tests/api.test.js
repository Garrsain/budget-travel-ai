const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('Welcome to Budget Travel Platform API');
    });
  });
  
  describe('GET /api/v1/search/hotels', () => {
    it('should return error if location is not provided', async () => {
      const res = await request(app).get('/api/v1/search/hotels');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('status', 'error');
    });
    
    it('should return hotel results when location is provided', async () => {
      const res = await request(app).get('/api/v1/search/hotels?location=New%20York');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('results');
      expect(Array.isArray(res.body.results)).toBeTruthy();
    });
  });
  
  describe('GET /api/v1/hotels/:id', () => {
    it('should return error if hotel ID is invalid', async () => {
      const res = await request(app).get('/api/v1/hotels/invalid-id');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('status', 'error');
    });
    
    it('should return hotel details for valid hotel ID', async () => {
      const res = await request(app).get('/api/v1/hotels/hotel1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('hotel');
      expect(res.body.hotel).toHaveProperty('hotel_id', 'hotel1');
    });
  });
  
  describe('GET /api/v1/insights/deals', () => {
    it('should return error if neither hotel_id nor location is provided', async () => {
      const res = await request(app).get('/api/v1/insights/deals');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('status', 'error');
    });
    
    it('should return deal insights for a location', async () => {
      const res = await request(app).get('/api/v1/insights/deals?location=New%20York');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('top_deals');
      expect(Array.isArray(res.body.top_deals)).toBeTruthy();
    });
  });
  
  describe('GET /api/v1/recommendations', () => {
    it('should return error if location is not provided', async () => {
      const res = await request(app).get('/api/v1/recommendations');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('status', 'error');
    });
    
    it('should return recommendations when location is provided', async () => {
      const res = await request(app).get('/api/v1/recommendations?location=New%20York');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.recommendations)).toBeTruthy();
    });
  });
  
  describe('GET /api/v1/booking/:hotel_id/link', () => {
    it('should generate booking link for a hotel', async () => {
      const res = await request(app).get('/api/v1/booking/hotel1/link');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('booking_link');
      expect(res.body.booking_link).toContain('booking.com');
    });
  });
});
