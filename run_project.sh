#!/bin/bash
# run_project.sh

echo "Starting College Management System..."

# Add PHP to PATH (User specific for XAMPP)
export PATH="/Applications/XAMPP/xamppfiles/bin:$PATH"

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "Error: PHP is not installed. Please install PHP (brew install php) or use XAMPP."
    exit 1
fi

# Kill existing processes on ports 8000 and 5173 to avoid conflicts
echo "Cleaning up old processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Run Database Setup (Idempotent)
echo "Setting up Database..."
php backend/setup_db.php

# Start Backend
echo "Starting Backend Server on port 8000..."
php -S localhost:8000 -t backend &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend Server..."
cd frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT