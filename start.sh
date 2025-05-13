#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Starting BarBaby Fitness Application${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing frontend dependencies...${NC}"
  npm install
fi

# Check if server/node_modules exists, if not, install server dependencies
if [ ! -d "server/node_modules" ]; then
  echo -e "${YELLOW}Installing server dependencies...${NC}"
  cd server && npm install && cd ..
fi

# Start both frontend and backend
echo -e "${GREEN}Starting frontend and backend servers...${NC}"
echo -e "${YELLOW}This will run both the React app and the payment processing server.${NC}"
echo -e "${BLUE}---------------------------------------${NC}"

# Run the combined script that starts both servers
npm run dev:all

# This script won't reach here unless the servers are stopped
echo -e "${GREEN}Servers stopped.${NC}"