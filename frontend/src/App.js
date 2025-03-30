import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminControlPanel from './pages/AdminControlPanel';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1E88E5', // Blue
    },
    secondary: {
      main: '#FFC107', // Amber
    },
    background: {
      default: '#FFFFFF',
    },
    text: {
      primary: '#212121',
    },
    success: {
      main: '#4CAF50', // Green for deal highlights
    },
    error: {
      main: '#FF5722', // Deep Orange for accents
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Open Sans',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'Open Sans, sans-serif',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1976D2',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/hotel/:id" element={<HotelDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminControlPanel />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
