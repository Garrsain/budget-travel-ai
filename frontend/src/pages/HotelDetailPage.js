import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import WifiIcon from '@mui/icons-material/Wifi';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import PoolIcon from '@mui/icons-material/Pool';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock data for hotel details
const mockHotelDetails = {
  hotel_id: 'hotel1',
  name: 'Urban Budget Hotel',
  description: 'Urban Budget Hotel offers comfortable accommodations in the heart of New York City. This charming property features simple but well-appointed rooms, perfect for travelers looking to explore the city on a budget. Located just a short walk from major attractions and public transportation, it provides an ideal base for your city adventure.',
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
  deal_insights: [
    {
      type: 'price_comparison',
      description: '35% cheaper than similar hotels in this area'
    },
    {
      type: 'price_drop',
      description: 'Price dropped 20% in the last week'
    },
    {
      type: 'value_assessment',
      description: 'Highly rated for cleanliness (9.2/10)'
    }
  ],
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
      name: 'Backpacker\'s Paradise',
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
};

const amenityIcons = {
  'Free WiFi': <WifiIcon />,
  'Breakfast included': <FreeBreakfastIcon />,
  'Air conditioning': <AcUnitIcon />,
  'Pool': <PoolIcon />,
  'Parking': <LocalParkingIcon />,
  'Restaurant': <RestaurantIcon />
};

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  
  // Simulate loading hotel details
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setHotel(mockHotelDetails);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Format price with currency symbol
  const formatPrice = (price, currency) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥'
    };
    
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${price}`;
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (!hotel) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Hotel Not Found
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back to Search
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Search Results
        </Button>
        
        {/* Image Gallery */}
        <Paper sx={{ position: 'relative', mb: 3, overflow: 'hidden', borderRadius: 2 }}>
          <Box
            component="img"
            src={hotel.images[currentImageIndex]}
            alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
            sx={{ 
              width: '100%', 
              height: { xs: '250px', md: '400px' },
              objectFit: 'cover'
            }}
          />
          
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'space-between',
            p: 1,
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <Button 
              variant="contained" 
              color="inherit" 
              size="small"
              onClick={handlePrevImage}
            >
              Prev
            </Button>
            <Typography color="white">
              {currentImageIndex + 1} / {hotel.images.length}
            </Typography>
            <Button 
              variant="contained" 
              color="inherit" 
              size="small"
              onClick={handleNextImage}
            >
              Next
            </Button>
          </Box>
        </Paper>
        
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {hotel.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={hotel.star_rating} 
                  readOnly 
                  precision={0.5}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {hotel.user_rating}/10
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({hotel.review_count} reviews)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOnIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {hotel.address.street}, {hotel.address.city}, {hotel.address.country}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  AI Deal Insights
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {hotel.deal_insights.map((insight, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {insight.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Description" />
                <Tab label="Amenities" />
                <Tab label="Location" />
              </Tabs>
              
              <Box sx={{ p: 1 }}>
                {tabValue === 0 && (
                  <Typography variant="body1" paragraph>
                    {hotel.description}
                  </Typography>
                )}
                
                {tabValue === 1 && (
                  <List>
                    {hotel.amenities.map((amenity, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {amenityIcons[amenity] || <CheckCircleIcon color="primary" />}
                        </ListItemIcon>
                        <ListItemText primary={amenity} />
                      </ListItem>
                    ))}
                  </List>
                )}
                
                {tabValue === 2 && (
                  <>
                    <Box 
                      component="img"
                      src={`https://via.placeholder.com/600x300?text=Map+of+${encodeURIComponent(hotel.address.city)}`}
                      alt="Hotel location map"
                      sx={{ 
                        width: '100%', 
                        borderRadius: 1,
                        mb: 2
                      }}
                    />
                    <List dense>
                      {hotel.location_highlights.map((highlight, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <LocationOnIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={highlight} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Box>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Similar Hotels You Might Like
              </Typography>
              <Grid container spacing={2}>
                {hotel.similar_hotels.map((similarHotel) => (
                  <Grid item xs={12} sm={4} key={similarHotel.hotel_id}>
                    <Card 
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/hotel/${similarHotel.hotel_id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={similarHotel.thumbnail}
                        alt={similarHotel.name}
                      />
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography variant="body2" noWrap>
                          {similarHotel.name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {similarHotel.user_rating}/10
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {formatPrice(similarHotel.price, similarHotel.currency)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          
          {/* Booking Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Price Details
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                {hotel.original_price && (
                  <Typography variant="body1" sx={{ textDecoration: 'line-through', mr: 1, color: 'text.secondary' }}>
                    {formatPrice(hotel.original_price, hotel.currency)}
                  </Typography>
                )}
                <Typography variant="h4" component="span" color="primary" fontWeight="bold">
                  {formatPrice(hotel.price, hotel.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  per night
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total: {formatPrice(hotel.price * 5, hotel.currency)} for 5 nights
              </Typography>
              
              {hotel.deal_score > 70 && (
                <Chip
                  label={hotel.deal_insights[0].description}
                  color="success"
                  sx={{ my: 2 }}
                />
              )}
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                href={hotel.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 2, mb: 3, py: 1.5 }}
              >
                Book Now on Booking.com
              </Button>
              
              <Typography variant="caption" color="text.secondary" display="block">
                By booking through our link, you help support our service at no extra cost to you.
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="body2" paragraph>
                <strong>Cancellation policy:</strong> Free cancellation up to 24 hours before check-in.
              </Typography>
              
              <Typography variant="body2">
                <strong>Check-in:</strong> From 3:00 PM
              </Typography>
              <Typography variant="body2">
                <strong>Check-out:</strong> Until 11:00 AM
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HotelDetailPage;
