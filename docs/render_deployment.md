# Deploying to Render

This guide explains how to deploy the Budget Travel Platform to Render.com, a cloud hosting service with a free tier.

## Prerequisites

1. Create a Render.com account at https://render.com/
2. Fork or clone this repository to your GitHub account

## Deployment Steps

### Automatic Deployment with render.yaml

1. Log in to your Render dashboard
2. Click "New" and select "Blueprint"
3. Connect your GitHub account if you haven't already
4. Select the repository containing the Budget Travel Platform
5. Render will automatically detect the `render.yaml` file and create the services
6. Click "Apply" to start the deployment

### Manual Deployment

If you prefer to set up the services manually:

#### Frontend Deployment

1. Log in to your Render dashboard
2. Click "New" and select "Static Site"
3. Connect your GitHub repository
4. Configure the service:
   - Name: budget-travel-frontend
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
5. Click "Create Static Site"

#### Backend Deployment

1. Log in to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: budget-travel-backend
   - Runtime: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node src/app.js`
   - Environment Variables:
     - NODE_ENV: production
     - PORT: 8080
     - BOOKING_AFFILIATE_ID: demo-affiliate-id
     - BOOKING_API_KEY: demo-api-key
5. Click "Create Web Service"

## Accessing Your Deployed Application

Once deployment is complete:

- Frontend: Access at `https://budget-travel-frontend.onrender.com`
- Backend API: Access at `https://budget-travel-backend.onrender.com`
- Admin Panel: Access at `https://budget-travel-frontend.onrender.com/admin`

## Updating Your Deployment

Any changes pushed to the main branch of your GitHub repository will automatically trigger a new deployment on Render.

## Monitoring

You can monitor your application's performance, logs, and metrics from the Render dashboard.
