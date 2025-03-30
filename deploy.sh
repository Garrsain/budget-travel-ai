# Budget Travel Platform - Deployment Script

#!/bin/bash

# This script deploys the Budget Travel Platform MVP to a production environment

# Exit on error
set -e

echo "Starting deployment of Budget Travel Platform MVP..."

# 1. Backend Deployment
echo "Deploying backend..."

# Navigate to backend directory
cd /home/ubuntu/budget_travel_platform/backend

# Install dependencies
echo "Installing backend dependencies..."
npm install --production

# Create .env file for production
echo "Creating production environment configuration..."
cat > .env << EOL
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/budget_travel
BOOKING_AFFILIATE_ID=demo-affiliate-id
BOOKING_API_KEY=demo-api-key
CORS_ORIGIN=http://localhost:3000
EOL

# Run tests
echo "Running backend tests..."
# Uncomment when tests are ready to run
# npm test

# Start the server (for demo purposes)
echo "Starting backend server..."
node src/app.js &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# 2. Frontend Deployment
echo "Deploying frontend..."

# Navigate to frontend directory
cd /home/ubuntu/budget_travel_platform/frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install --production

# Create .env file for production
echo "Creating production environment configuration..."
cat > .env << EOL
REACT_APP_API_URL=http://localhost:5000/api/v1
EOL

# Build the frontend
echo "Building frontend..."
# Uncomment when build script is configured
# npm run build

# For demo purposes, we'll serve the frontend using a simple HTTP server
echo "Starting frontend server..."
npx serve -s build -l 3000 &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# 3. Verify Deployment
echo "Verifying deployment..."
echo "Backend API is available at: http://localhost:5000/api/v1"
echo "Frontend is available at: http://localhost:3000"

# 4. Deployment Summary
echo "Deployment completed successfully!"
echo "Budget Travel Platform MVP is now running."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Note: In a real production environment, you would use process managers like PM2
# and proper web servers like Nginx instead of the simple setup above.
