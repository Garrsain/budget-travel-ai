import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  Rating,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WifiIcon from '@mui/icons-material/Wifi';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import PoolIcon from '@mui/icons-material/Pool';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const amenityIcons = {
  wifi: <WifiIcon fontSize="small" />,
  breakfast: <FreeBreakfastIcon fontSize="small" />,
  pool: <PoolIcon fontSize="small" />
};

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  
  // Destructure hotel properties with defaults for safety
  const {
    hotel_id = '',
    name = 'Hotel Name',
    thumbnail = 'https://via.placeholder.com/300x200?text=Hotel+Image',
    address = { city: 'City', country: 'Country' },
    star_rating = 3,
    user_rating = 8.0,
    price = 0,
    original_price,
    currency = 'USD',
    deal_score = 0,
    deal_summary = '',
    amenities = []
  } = hotel;
  
  const handleClick = () => {
    navigate(`/hotel/${hotel_id}`);
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
  
  // Determine if this is a good deal (deal_score > 70)
  const isGoodDeal = deal_score > 70;
  
  return (
    <Card 
      className="hotel-card" 
      onClick={handleClick}
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image={thumbnail}
        alt={name}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {address.city}, {address.country}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={star_rating} 
            readOnly 
            size="small" 
            precision={0.5}
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {user_rating}/10
          </Typography>
        </Box>
        
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}
        >
          {amenities.slice(0, 3).map((amenity, index) => (
            <Chip
              key={index}
              icon={amenityIcons[amenity] || null}
              label={amenity}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
        
        {isGoodDeal && (
          <Chip
            label={deal_summary}
            color="success"
            size="small"
            className="deal-badge"
            sx={{ mb: 1, alignSelf: 'flex-start' }}
          />
        )}
        
        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'baseline' }}>
          {original_price && (
            <Typography variant="body2" className="original-price">
              {formatPrice(original_price, currency)}
            </Typography>
          )}
          <Typography variant="h6" component="span" className="current-price">
            {formatPrice(price, currency)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            per night
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
