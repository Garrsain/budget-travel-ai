# Budget Travel Platform - MVP Deployment Guide

## Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Local Development Setup

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-org/budget-travel-platform.git
cd budget-travel-platform/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env file with your configuration

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Production Deployment

### Backend Deployment (Heroku)
```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create budget-travel-api

# Add MongoDB add-on
heroku addons:create mongodb:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set BOOKING_AFFILIATE_ID=your-affiliate-id
heroku config:set BOOKING_API_KEY=your-api-key

# Deploy to Heroku
git subtree push --prefix backend heroku main

# Ensure dynos are running
heroku ps:scale web=1
```

### Frontend Deployment (Netlify)
1. Create a new site on Netlify
2. Connect to your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/build`
5. Set environment variables:
   - `REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api/v1`
6. Deploy the site

## Configuration

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/budget_travel
BOOKING_AFFILIATE_ID=your-affiliate-id
BOOKING_API_KEY=your-api-key
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## Testing

### Running Backend Tests
```bash
cd backend
npm test
```

### Running Frontend Tests
```bash
cd frontend
npm test
```

## Monitoring

### Setting Up Basic Monitoring
1. Create a free account on Sentry.io
2. Integrate Sentry with your backend:
   ```javascript
   const Sentry = require('@sentry/node');
   Sentry.init({ dsn: 'your-sentry-dsn' });
   ```
3. Integrate Sentry with your frontend:
   ```javascript
   import * as Sentry from '@sentry/react';
   Sentry.init({ dsn: 'your-sentry-dsn' });
   ```

## Backup Strategy

### Database Backup
1. For MongoDB Atlas:
   - Enable automated backups in Atlas dashboard
   - Schedule daily backups
2. For self-hosted MongoDB:
   - Set up cron job to run mongodump daily
   - Store backups in secure location

## Scaling Considerations

### Backend Scaling
- Implement caching for frequently accessed data
- Use load balancing for multiple instances
- Consider serverless functions for specific endpoints

### Frontend Scaling
- Use CDN for static assets
- Implement code splitting
- Optimize images and assets

## Future Enhancements
- Add user authentication
- Implement user profiles and saved searches
- Add flight and car rental integrations
- Develop mobile app using React Native
