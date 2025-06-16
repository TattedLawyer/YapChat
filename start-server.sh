#!/bin/bash

# AI Companion Development Server Startup Script
# This ensures the server always starts from the correct directory

echo "🚀 AI Companion Development Server"
echo "=================================="
echo ""

# Navigate to the correct directory
cd /Users/michaelchristine/ai-companion/frontend

# Verify we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Not in the correct directory!"
    echo "Expected: /Users/michaelchristine/ai-companion/frontend"
    echo "Current: $(pwd)"
    exit 1
fi

echo "✅ Directory: $(pwd)"
echo "✅ API Key: $(grep -c "sk-ant-" .env.local) configured"
echo ""

# Kill any existing Next.js processes
echo "🛑 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start the development server
echo "🎯 Starting development server..."
npm run dev 