import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import RecommendIcon from '@mui/icons-material/Recommend';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SpeedIcon from '@mui/icons-material/Speed';
import EmailIcon from '@mui/icons-material/Email';

const AboutPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About Budget Travel Finder
        </Typography>
        
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            Budget Travel Finder was created with a simple mission: to help budget-conscious travelers find the absolute best hotel deals without spending hours searching across dozens of websites.
          </Typography>
          <Typography variant="body1" paragraph>
            We believe that everyone deserves a comfortable place to stay when traveling, regardless of their budget. Our AI-powered platform is designed to cut through the noise and highlight truly exceptional deals that offer the best value for your money.
          </Typography>
          <Typography variant="body1">
            Unlike other travel sites that try to serve everyone, we focus exclusively on budget travelers - students, digital nomads, backpackers, and anyone else who wants to maximize their travel experience while minimizing costs.
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 4, mb: 4 }} id="how-it-works">
          <Typography variant="h5" gutterBottom>
            How It Works
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                Budget Travel Finder uses advanced AI technology to analyze millions of hotel listings across the web. Our platform doesn't just find cheap hotels - it finds <em>great value</em> hotels that offer the best combination of price, quality, location, and amenities.
              </Typography>
              <Typography variant="body1">
                Here's what makes our platform different:
              </Typography>
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
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">AI-Powered Deal Discovery</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    Our Deal Discovery AI Agent continuously scans hotel listings to identify exceptional deals. It analyzes:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Historical pricing data to identify when current prices are lower than usual" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Price-to-quality ratios to find hotels that offer more amenities or better ratings than similarly priced options" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Seasonal trends to determine if current prices represent a good value for the time of year" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="User reviews to identify hotels that consistently deliver positive experiences for budget travelers" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <SearchIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.8 }} />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Smart Recommendations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    Our Recommendation AI Agent provides personalized hotel suggestions based on:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Your search patterns and preferences" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="The specific needs of budget travelers (prioritizing essential amenities like WiFi)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Location convenience for budget travelers (proximity to public transportation)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Clear explanations of why each recommendation is a good match for you" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RecommendIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.8 }} />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Budget-Focused Design</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    Everything about our platform is designed with budget travelers in mind:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Clean, minimalist interface that loads quickly even on slow connections" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Mobile-first design since most budget travelers book on their phones" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Focus on value metrics rather than luxury features" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Clear price information with no hidden fees or surprises" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <MoneyOffIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.8 }} />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Fast, Efficient Booking</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    We've streamlined the booking process to save you time and effort:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Direct links to trusted booking partners like Booking.com" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="No account creation required to search for deals" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Simple search interface with only essential filters" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Transparent affiliate relationship that doesn't increase your costs" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <SpeedIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.8 }} />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Paper>
        
        <Paper sx={{ p: 4 }} id="contact">
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            We're always looking to improve our service and would love to hear your feedback, suggestions, or questions.
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                The best way to reach us is via email:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  support@budgettravelfinder.com
                </Typography>
              </Box>
              <Typography variant="body1">
                We aim to respond to all inquiries within 24 hours.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box 
                component="img"
                src="https://via.placeholder.com/400x300?text=Contact+Us"
                alt="Contact us"
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  boxShadow: 2
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage;
