import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Button
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';

// Mock data for search results
const mockSearchResults = [
  {
    hotel_id: 'hotel1',
    name: 'Urban Budget Hotel',
    thumbnail: 'https://via.placeholder.com/300x200?text=Urban+Budget+Hotel',
    address: { city: 'New York', country: 'USA' },
    star_rating: 3,
    user_rating: 8.5,
    price: 75,
    original_price: 95,
    currency: 'USD',
    deal_score: 85,
    deal_summary: '35% cheaper than similar hotels',
    amenities: ['wifi', 'breakfast', 'pool']
  },
  {
    hotel_id: 'hotel2',
    name: 'Cozy Stay Inn',
    thumbnail: 'https://via.placeholder.com/300x200?text=Cozy+Stay+Inn',
    address: { city: 'New York', country: 'USA' },
    star_rating: 3,
    user_rating: 8.2,
    price: 82,
    original_price: 110,
    currency: 'USD',
    deal_score: 80,
    deal_summary: 'Great value: 3-star amenities at a 2-star price',
    amenities: ['wifi', 'breakfast']
  },
  {
    hotel_id: 'hotel3',
    name: 'Backpacker\'s Paradise',
    thumbnail: 'https://via.placeholder.com/300x200?text=Backpackers+Paradise',
    address: { city: 'New York', country: 'USA' },
    star_rating: 2,
    user_rating: 7.9,
    price: 25,
    original_price: 35,
    currency: 'USD',
    deal_score: 90,
    deal_summary: 'Best value in the city center',
    amenities: ['wifi']
  },
  {
    hotel_id: 'hotel4',
    name: 'Downtown Budget Suites',
    thumbnail: 'https://via.placeholder.com/300x200?text=Downtown+Budget+Suites',
    address: { city: 'New York', country: 'USA' },
    star_rating: 3,
    user_rating: 8.0,
    price: 89,
    original_price: null,
    currency: 'USD',
    deal_score: 75,
    deal_summary: 'Highly rated for cleanliness (9.2/10)',
    amenities: ['wifi', 'pool']
  },
  {
    hotel_id: 'hotel5',
    name: 'Traveler\'s Rest Hotel',
    thumbnail: 'https://via.placeholder.com/300x200?text=Travelers+Rest+Hotel',
    address: { city: 'New York', country: 'USA' },
    star_rating: 2,
    user_rating: 7.5,
    price: 65,
    original_price: 80,
    currency: 'USD',
    deal_score: 70,
    deal_summary: 'Price dropped 20% in the last week',
    amenities: ['wifi', 'breakfast']
  },
  {
    hotel_id: 'hotel6',
    name: 'City Center Hostel',
    thumbnail: 'https://via.placeholder.com/300x200?text=City+Center+Hostel',
    address: { city: 'New York', country: 'USA' },
    star_rating: 2,
    user_rating: 7.8,
    price: 30,
    original_price: null,
    currency: 'USD',
    deal_score: 85,
    deal_summary: '40% cheaper than similar properties',
    amenities: ['wifi']
  }
];

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchLocation = queryParams.get('location') || '';
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState('best_deal');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [minRating, setMinRating] = useState(0);
  const [amenities, setAmenities] = useState({
    wifi: false,
    breakfast: false,
    pool: false
  });
  
  // Simulate loading search results
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setResults(mockSearchResults);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [searchLocation]);
  
  const handleSearch = (searchParams) => {
    // In a real app, this would trigger a new search
    console.log('New search params:', searchParams);
    navigate(`/search?location=${encodeURIComponent(searchParams.location)}`);
  };
  
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    
    // Sort results based on selected option
    const sortedResults = [...results];
    switch(event.target.value) {
      case 'price_low':
        sortedResults.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sortedResults.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedResults.sort((a, b) => b.user_rating - a.user_rating);
        break;
      case 'best_deal':
      default:
        sortedResults.sort((a, b) => b.deal_score - a.deal_score);
        break;
    }
    
    setResults(sortedResults);
  };
  
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  
  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue);
  };
  
  const handleAmenityChange = (event) => {
    setAmenities({
      ...amenities,
      [event.target.name]: event.target.checked
    });
  };
  
  // Filter results based on selected filters
  const filteredResults = results.filter(hotel => {
    // Price filter
    if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) {
      return false;
    }
    
    // Rating filter
    if (hotel.user_rating < minRating) {
      return false;
    }
    
    // Amenities filter
    for (const [amenity, isSelected] of Object.entries(amenities)) {
      if (isSelected && !hotel.amenities.includes(amenity)) {
        return false;
      }
    }
    
    return true;
  });
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        <SearchBar onSearch={handleSearch} />
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1">
              {searchLocation ? `Hotels in ${searchLocation}` : 'Search Results'}
            </Typography>
            
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="sort-select-label">Sort by</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortBy}
                label="Sort by"
                onChange={handleSortChange}
              >
                <MenuItem value="best_deal">Best Deal</MenuItem>
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rating</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {/* Filters sidebar */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography id="price-range-slider" gutterBottom>
                  Price Range
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={300}
                  aria-labelledby="price-range-slider"
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    ${priceRange[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${priceRange[1]}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography id="rating-slider" gutterBottom>
                  Minimum Rating
                </Typography>
                <Slider
                  value={minRating}
                  onChange={handleRatingChange}
                  valueLabelDisplay="auto"
                  step={0.5}
                  marks
                  min={0}
                  max={10}
                  aria-labelledby="rating-slider"
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Amenities
                </Typography>
                <FormGroup>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={amenities.wifi} 
                        onChange={handleAmenityChange} 
                        name="wifi" 
                      />
                    } 
                    label="WiFi" 
                  />
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={amenities.breakfast} 
                        onChange={handleAmenityChange} 
                        name="breakfast" 
                      />
                    } 
                    label="Breakfast" 
                  />
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={amenities.pool} 
                        onChange={handleAmenityChange} 
                        name="pool" 
                      />
                    } 
                    label="Pool" 
                  />
                </FormGroup>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => {
                  setPriceRange([0, 300]);
                  setMinRating(0);
                  setAmenities({
                    wifi: false,
                    breakfast: false,
                    pool: false
                  });
                }}
              >
                Clear Filters
              </Button>
            </Grid>
            
            {/* Search results */}
            <Grid item xs={12} md={9}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredResults.length > 0 ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      {filteredResults.length} hotels found
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {filteredResults.map((hotel) => (
                      <Grid item xs={12} sm={6} lg={4} key={hotel.hotel_id}>
                        <HotelCard hotel={hotel} />
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                  <Typography variant="h6">
                    No hotels match your filters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters to see more results
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default SearchResultsPage;
