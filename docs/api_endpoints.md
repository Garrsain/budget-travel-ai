# API Endpoints for Budget Travel Platform

## Overview
This document outlines the API endpoints for the Budget Travel Platform MVP, focusing on supporting the frontend interface and AI-powered features.

## Base URL
`/api/v1`

## Authentication
No authentication required for MVP. All endpoints are public.

## Endpoints

### Search Endpoints

#### Search Hotels
- **Endpoint**: `/search/hotels`
- **Method**: GET
- **Description**: Search for hotels based on location, dates, and filters
- **Parameters**:
  - `location` (required): City, region, or point of interest
  - `checkin` (required): Check-in date (YYYY-MM-DD)
  - `checkout` (required): Check-out date (YYYY-MM-DD)
  - `guests` (required): Number of guests
  - `max_price` (optional): Maximum price per night
  - `min_rating` (optional): Minimum user rating (1-10)
  - `amenities` (optional): Comma-separated list of required amenities
  - `sort_by` (optional): Sort results by (best_deal, price_low, price_high, rating)
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of results per page (default: 20)
- **Response**:
  ```json
  {
    "status": "success",
    "count": 42,
    "page": 1,
    "total_pages": 3,
    "results": [
      {
        "hotel_id": "string",
        "name": "string",
        "thumbnail": "string",
        "address": {
          "city": "string",
          "country": "string"
        },
        "star_rating": 3,
        "user_rating": 8.5,
        "price": 75.00,
        "original_price": 95.00,
        "currency": "USD",
        "deal_score": 85,
        "deal_summary": "35% cheaper than similar hotels in this area",
        "amenities": ["wifi", "breakfast", "pool"]
      }
    ]
  }
  ```

#### Get Hotel Details
- **Endpoint**: `/hotels/{hotel_id}`
- **Method**: GET
- **Description**: Get detailed information about a specific hotel
- **Parameters**:
  - `hotel_id` (required): Unique identifier for the hotel
  - `checkin` (required): Check-in date (YYYY-MM-DD)
  - `checkout` (required): Check-out date (YYYY-MM-DD)
  - `guests` (required): Number of guests
- **Response**:
  ```json
  {
    "status": "success",
    "hotel": {
      "hotel_id": "string",
      "name": "string",
      "description": "string",
      "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "country": "string",
        "postal_code": "string",
        "coordinates": {
          "latitude": 0,
          "longitude": 0
        }
      },
      "star_rating": 3,
      "user_rating": 8.5,
      "review_count": 245,
      "images": ["url1", "url2", "url3"],
      "amenities": ["wifi", "breakfast", "pool"],
      "price": 75.00,
      "original_price": 95.00,
      "currency": "USD",
      "deal_score": 85,
      "deal_insights": [
        {
          "type": "price_drop",
          "description": "Price dropped 20% in the last week"
        },
        {
          "type": "value_assessment",
          "description": "Great value: 3-star amenities at a 2-star price"
        }
      ],
      "booking_url": "https://booking.com/affiliate-link"
    }
  }
  ```

#### Get Location Suggestions
- **Endpoint**: `/locations/suggest`
- **Method**: GET
- **Description**: Get location suggestions based on user input
- **Parameters**:
  - `query` (required): User input for location search
  - `limit` (optional): Number of suggestions to return (default: 5)
- **Response**:
  ```json
  {
    "status": "success",
    "suggestions": [
      {
        "location_id": "string",
        "name": "string",
        "type": "city",
        "country": "string"
      }
    ]
  }
  ```

### AI Feature Endpoints

#### Get Deal Insights
- **Endpoint**: `/insights/deals`
- **Method**: GET
- **Description**: Get AI-generated insights about current hotel deals
- **Parameters**:
  - `location` (required): City, region, or point of interest
  - `limit` (optional): Number of insights to return (default: 10)
- **Response**:
  ```json
  {
    "status": "success",
    "insights": [
      {
        "hotel_id": "string",
        "hotel_name": "string",
        "insight_type": "price_drop",
        "description": "Prices just dropped 30% for next week",
        "confidence_score": 92,
        "thumbnail": "string"
      }
    ]
  }
  ```

#### Get Personalized Recommendations
- **Endpoint**: `/recommendations`
- **Method**: GET
- **Description**: Get personalized hotel recommendations based on search history
- **Parameters**:
  - `session_id` (required): Anonymous session identifier
  - `location` (optional): Target location
  - `limit` (optional): Number of recommendations to return (default: 5)
- **Response**:
  ```json
  {
    "status": "success",
    "recommendations": [
      {
        "hotel_id": "string",
        "name": "string",
        "thumbnail": "string",
        "price": 75.00,
        "currency": "USD",
        "reason": "Based on your interest in budget-friendly hotels with pools"
      }
    ]
  }
  ```

### Analytics Endpoints

#### Log Search
- **Endpoint**: `/analytics/search`
- **Method**: POST
- **Description**: Log a search event for analytics
- **Request Body**:
  ```json
  {
    "session_id": "string",
    "location": "string",
    "checkin": "2025-04-15",
    "checkout": "2025-04-20",
    "guests": 2,
    "filters": {
      "max_price": 100,
      "min_rating": 7
    },
    "device_type": "mobile"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "search_id": "string"
  }
  ```

#### Log Click
- **Endpoint**: `/analytics/click`
- **Method**: POST
- **Description**: Log a click event for analytics
- **Request Body**:
  ```json
  {
    "session_id": "string",
    "search_id": "string",
    "hotel_id": "string",
    "position": 3,
    "action_type": "view_details"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success"
  }
  ```

## Error Handling

All endpoints return standard error responses:

```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid parameters"
}
```

Common error codes:
- 400: Bad Request (invalid parameters)
- 404: Not Found (resource not found)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Rate Limiting

- 100 requests per minute per IP address
- Rate limit headers included in all responses

## Versioning

API versioning is included in the URL path (/api/v1) to ensure backward compatibility as the platform evolves.

## Conclusion

These API endpoints provide the necessary functionality for the Budget Travel Platform MVP, supporting the frontend interface and AI-powered features while maintaining a clean and minimalist design focused on the needs of budget travelers.
