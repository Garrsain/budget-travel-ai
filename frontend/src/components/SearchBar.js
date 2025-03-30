import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Typography,
  Grid,
  Container,
  InputAdornment,
  IconButton,
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

// Mock data for location suggestions
const locationSuggestions = [
  { label: 'New York, USA' },
  { label: 'London, UK' },
  { label: 'Paris, France' },
  { label: 'Tokyo, Japan' },
  { label: 'Barcelona, Spain' },
  { label: 'Bangkok, Thailand' },
  { label: 'Berlin, Germany' },
  { label: 'Rome, Italy' },
];

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    if (location && checkIn && checkOut) {
      onSearch({
        location: location.label,
        checkIn,
        checkOut,
        guests
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card elevation={3} className="search-container">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Find the best hotel deals for your budget
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={locationSuggestions}
                value={location}
                onChange={(event, newValue) => {
                  setLocation(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Where are you going?"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOnIcon color="primary" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Check-in"
                value={checkIn}
                onChange={(newValue) => {
                  setCheckIn(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Check-out"
                value={checkOut}
                onChange={(newValue) => {
                  setCheckOut(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={checkIn || new Date()}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, max: 10 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSearch}
                sx={{ height: '56px' }}
                startIcon={<SearchIcon />}
                disabled={!location || !checkIn || !checkOut}
              >
                Find Deals
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default SearchBar;
