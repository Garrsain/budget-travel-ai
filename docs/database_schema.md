# Database Schema for Budget Travel Platform

## Overview
This document outlines the database schema for the Budget Travel Platform MVP, focusing on storing hotel data, pricing information, and supporting the AI-powered deal discovery and recommendation systems.

## Collections/Tables

### 1. Hotels
Stores core information about hotel properties.

```json
{
  "hotel_id": "string",          // Unique identifier from provider (e.g., Booking.com)
  "name": "string",              // Hotel name
  "description": "string",       // Hotel description
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postal_code": "string",
    "coordinates": {
      "latitude": "number",
      "longitude": "number"
    }
  },
  "star_rating": "number",       // Official star rating (1-5)
  "user_rating": "number",       // Average user rating (1-10)
  "review_count": "number",      // Number of user reviews
  "amenities": ["string"],       // Array of available amenities
  "images": ["string"],          // Array of image URLs
  "property_type": "string",     // Hotel, Hostel, Apartment, etc.
  "tags": ["string"],            // Budget, Family-friendly, etc.
  "created_at": "date",
  "updated_at": "date"
}
```

### 2. Prices
Stores current and historical pricing information.

```json
{
  "price_id": "string",          // Unique identifier
  "hotel_id": "string",          // Reference to Hotels collection
  "provider": "string",          // Booking.com, etc.
  "room_type": "string",         // Single, Double, Suite, etc.
  "date_from": "date",           // Check-in date
  "date_to": "date",             // Check-out date
  "price": "number",             // Current price
  "original_price": "number",    // Original price (if discounted)
  "currency": "string",          // USD, EUR, etc.
  "availability": "boolean",     // Whether the room is available
  "timestamp": "date",           // When this price was recorded
  "deal_score": "number",        // AI-calculated deal score (0-100)
  "deal_factors": {              // Factors contributing to deal score
    "historical_comparison": "number",
    "value_assessment": "number",
    "seasonal_factor": "number"
  }
}
```

### 3. Locations
Stores information about destinations.

```json
{
  "location_id": "string",       // Unique identifier
  "name": "string",              // Location name
  "type": "string",              // City, Region, Country
  "parent_id": "string",         // Reference to parent location
  "coordinates": {
    "latitude": "number",
    "longitude": "number"
  },
  "popularity_score": "number",  // Popularity with budget travelers
  "tags": ["string"],            // Beach, Mountain, Urban, etc.
  "average_price": "number",     // Average hotel price
  "currency": "string",          // Local currency
  "timezone": "string",          // Local timezone
  "created_at": "date",
  "updated_at": "date"
}
```

### 4. SearchLogs
Stores anonymized search data for analytics and improving recommendations.

```json
{
  "search_id": "string",         // Unique identifier
  "location": "string",          // Searched location
  "date_from": "date",           // Check-in date
  "date_to": "date",             // Check-out date
  "guests": "number",            // Number of guests
  "filters": {                   // Applied filters
    "max_price": "number",
    "min_rating": "number",
    "amenities": ["string"]
  },
  "results_count": "number",     // Number of results returned
  "timestamp": "date",           // When the search was performed
  "device_type": "string",       // Mobile, Desktop, Tablet
  "session_id": "string"         // Anonymous session identifier
}
```

### 5. ClickLogs
Stores anonymized user interaction data.

```json
{
  "click_id": "string",          // Unique identifier
  "search_id": "string",         // Reference to SearchLogs
  "hotel_id": "string",          // Reference to Hotels
  "position": "number",          // Position in search results
  "action_type": "string",       // View, BookingClick, etc.
  "timestamp": "date",           // When the action occurred
  "session_id": "string"         // Anonymous session identifier
}
```

### 6. DealInsights
Stores AI-generated insights about deals.

```json
{
  "insight_id": "string",        // Unique identifier
  "hotel_id": "string",          // Reference to Hotels
  "insight_type": "string",      // PriceDrop, GoodValue, etc.
  "description": "string",       // Human-readable description
  "confidence_score": "number",  // AI confidence (0-100)
  "supporting_data": {           // Data supporting the insight
    "price_comparison": "object",
    "historical_analysis": "object"
  },
  "valid_from": "date",          // When the insight becomes valid
  "valid_to": "date",            // When the insight expires
  "created_at": "date"
}
```

### 7. RecommendationModels
Stores parameters for recommendation models.

```json
{
  "model_id": "string",          // Unique identifier
  "model_type": "string",        // ValueFinder, PersonalizedRec, etc.
  "parameters": "object",        // Model-specific parameters
  "performance_metrics": {       // Model performance metrics
    "accuracy": "number",
    "recall": "number",
    "precision": "number"
  },
  "active": "boolean",           // Whether the model is active
  "created_at": "date",
  "updated_at": "date"
}
```

## Relationships

1. **Hotels** to **Prices**: One-to-many (one hotel has many price records)
2. **Locations** to **Hotels**: One-to-many (one location has many hotels)
3. **Locations** to **Locations**: Self-referential (hierarchical locations)
4. **SearchLogs** to **ClickLogs**: One-to-many (one search has many clicks)
5. **Hotels** to **DealInsights**: One-to-many (one hotel has many insights)
6. **Hotels** to **ClickLogs**: One-to-many (one hotel has many clicks)

## Indexing Strategy

### Hotels Collection
- Primary Index: `hotel_id`
- Secondary Indexes:
  - `address.city`, `address.country` (for location-based queries)
  - `star_rating`, `user_rating` (for filtering)
  - `property_type`, `tags` (for filtering)
  - Geospatial index on `address.coordinates` (for proximity searches)

### Prices Collection
- Primary Index: `price_id`
- Secondary Indexes:
  - `hotel_id` (for joining with Hotels)
  - `date_from`, `date_to` (for date range queries)
  - `deal_score` (for finding the best deals)
  - Compound index on `hotel_id`, `date_from`, `date_to` (for specific availability checks)

### Locations Collection
- Primary Index: `location_id`
- Secondary Indexes:
  - `name` (for search)
  - `type` (for filtering by location type)
  - `parent_id` (for hierarchical queries)
  - Geospatial index on `coordinates` (for proximity searches)

### SearchLogs and ClickLogs Collections
- Time-to-live (TTL) indexes to automatically expire old data
- Indexes on `session_id` for session analysis
- Indexes on `timestamp` for time-based analysis

## Data Retention Policy

- **Hotels and Locations**: Permanent storage with regular updates
- **Prices**: Historical prices retained for 1 year for trend analysis
- **SearchLogs and ClickLogs**: Anonymized data retained for 90 days
- **DealInsights**: Retained until `valid_to` date, then archived

## Scaling Considerations

- Sharding strategy based on geographical regions for Hotels and Prices
- Read replicas for high-traffic queries
- Time-series optimization for Prices collection
- Caching layer for frequently accessed data

## Data Security

- No personally identifiable information stored
- Encryption for sensitive data fields
- Access control based on role-based permissions
- Regular backups and disaster recovery plan

## Conclusion

This database schema is designed to support the core functionality of the Budget Travel Platform MVP while providing the necessary data structures for AI-powered deal discovery and recommendations. The schema is optimized for the specific needs of budget travelers and focuses on storing the most relevant information for identifying and presenting great hotel deals.
