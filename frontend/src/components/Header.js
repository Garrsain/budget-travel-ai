import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            BUDGET TRAVEL FINDER
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, ml: 2 }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/search"
              sx={{ mr: 1 }}
            >
              Search
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/about"
            >
              How It Works
            </Button>
          </Box>
          
          <Button 
            variant="outlined" 
            color="inherit"
            component={RouterLink}
            to="/search"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Find Deals
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
