import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';

// Mock components to simplify testing
jest.mock('../src/components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../src/components/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../src/pages/HomePage', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('../src/pages/SearchResultsPage', () => () => <div data-testid="search-results-page">Search Results Page</div>);
jest.mock('../src/pages/HotelDetailPage', () => () => <div data-testid="hotel-detail-page">Hotel Detail Page</div>);
jest.mock('../src/pages/AboutPage', () => () => <div data-testid="about-page">About Page</div>);
jest.mock('../src/pages/NotFoundPage', () => () => <div data-testid="not-found-page">Not Found Page</div>);

describe('App Component', () => {
  test('renders header and footer', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
  
  test('renders home page by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
