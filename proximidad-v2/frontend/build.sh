#!/bin/bash
# Build script for ProXimidad Frontend

echo "🚀 Building ProXimidad Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

echo "✅ Frontend build completed!"
echo "🔗 Production files in /dist folder"
echo "🔗 Run dev: npm run dev"
