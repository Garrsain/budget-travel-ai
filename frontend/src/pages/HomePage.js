import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Button
} from '@mui/material';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';

// Mock data for featured deals
const featuredDeals = [
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
    address: { city: 'London', country: 'UK' },
    star_rating: 3,
    user_rating: 8.2,
    price: 82,
    original_price: 110,
    currency: 'USD',
    deal_score: 80,
    deal_summary: 'Just dropped in price yesterday',
    amenities: ['wifi', 'breakfast']
  },
  {
    hotel_id: 'hotel3',
    name: 'Backpacker\'s Paradise',
    thumbnail: 'https://via.placeholder.com/300x200?text=Backpackers+Paradise',
    address: { city: 'Bangkok', country: 'Thailand' },
    star_rating: 2,
    user_rating: 7.9,
    price: 25,
    original_price: 35,
    currency: 'USD',
    deal_score: 90,
    deal_summary: 'Best value in the city center',
    amenities: ['wifi']
  }
];

const HomePage = () => {
  const handleSearch = (searchParams) => {
    // In a real app, this would navigate to search results with query params
    console.log('Search params:', searchParams);
    window.location.href = `/search?location=${encodeURIComponent(searchParams.location)}`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Find Amazing Hotel Deals for Budget Travelers
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          AI-powered deal discovery helps you find the best value hotels anywhere
        </Typography>
      </Box>
      
      <SearchBar onSearch={handleSearch} />
      
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Today's Top Deals
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Our AI found these exceptional hotel deals just for you
        </Typography>
        
        <Grid container spacing={3}>
          {featuredDeals.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel.hotel_id}>
              <HotelCard hotel={hotel} />
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ my: 6 }}>
        <Paper sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                How It Works
              </Typography>
              <Typography variant="body1" paragraph>
                Our AI-powered platform searches through millions of hotel listings to find the absolute best deals for budget travelers.
              </Typography>
              <Typography variant="body1" paragraph>
                We analyze prices, compare them to historical data, and evaluate the overall value to ensure you're getting the most for your money.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                href="/about"
                sx={{ mt: 2 }}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="https://via.placeholder.com/600x400?text=How+It+Works"
                alt="How our platform works"
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Why Budget Travelers Love Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Best Value Deals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI finds hotels that offer the most amenities and quality for the lowest prices.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Simple & Fast
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No complicated filters or endless scrolling. Just quick results with the best deals highlighted.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Smart Recommendations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get personalized suggestions based on what matters most to budget travelers.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
