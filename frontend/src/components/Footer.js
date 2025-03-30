import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Budget Travel Finder
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Helping budget travelers find the best deals
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Link href="/about" color="inherit" underline="hover">
              About
            </Link>
            <Link href="/about#how-it-works" color="inherit" underline="hover">
              How It Works
            </Link>
            <Link href="/about#contact" color="inherit" underline="hover">
              Contact
            </Link>
          </Box>
        </Box>
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2, display: 'block' }}>
          We use affiliate links to earn commissions. When you book through our links, you pay the same price while supporting our service.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
