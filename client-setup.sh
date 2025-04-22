#!/bin/bash

# Client-only setup script for LinkLinkup
# This script removes server-side files and prepares the project for client-only deployment

echo "Starting client-only setup..."

# Remove server directory
echo "Removing server directory..."
rm -rf server/

# Remove API directory (serverless functions)
echo "Removing API directory..."
rm -rf api/

# Remove server build scripts
echo "Removing server build scripts..."
rm -f esbuild-server.js
rm -f server-stop.js

# Update package.json (already done through the tool)
echo "Package.json already updated."

# Update .gitignore to include server directories
echo "Updating .gitignore..."
echo "" >> .gitignore
echo "# Removed server directories" >> .gitignore
echo "server/" >> .gitignore
echo "api/" >> .gitignore

echo "Client-only setup complete!"
echo ""
echo "NEXT STEPS:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Run 'npm run build' to build for production"
echo "3. Deploy the 'public' directory to your hosting provider"
echo ""
echo "IMPORTANT: Make sure your Supabase connection in databaseService.js is working correctly" 